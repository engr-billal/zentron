-- Phase 3: digital contracts + milestone schedule.
-- Contracts snapshot brief terms + fee. Both parties sign in-platform.
-- Milestones split the fee into deliverable-level units that Phase 4 escrow
-- will tie to Stripe payment intents. For now they stay at status='pending'.

create type contract_status as enum (
  'draft',
  'pending_creator',
  'active',
  'declined',
  'cancelled',
  'completed'
);

create type milestone_status as enum (
  'pending',
  'submitted',
  'approved',
  'rejected',
  'released'
);

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references public.briefs(id) on delete restrict,
  brand_id uuid not null references public.brand_profiles(id) on delete cascade,
  creator_id uuid not null references public.creator_profiles(id) on delete cascade,
  title text not null,
  scope text not null,
  total_fee_cents integer not null check (total_fee_cents >= 0),
  currency text not null default 'USD',
  exclusivity text,
  usage_rights text,
  start_date date,
  end_date date,
  status contract_status not null default 'draft',
  signed_brand_at timestamptz,
  signed_creator_at timestamptz,
  cancelled_at timestamptz,
  cancelled_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger contracts_set_updated_at
  before update on public.contracts
  for each row execute function public.set_updated_at();
create index contracts_brand_status_idx on public.contracts(brand_id, status);
create index contracts_creator_status_idx on public.contracts(creator_id, status);
create index contracts_brief_id_idx on public.contracts(brief_id);

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  sequence integer not null check (sequence >= 1),
  title text not null,
  description text,
  amount_cents integer not null check (amount_cents >= 0),
  due_at date,
  status milestone_status not null default 'pending',
  submitted_at timestamptz,
  approved_at timestamptz,
  released_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (contract_id, sequence)
);
create trigger milestones_set_updated_at
  before update on public.milestones
  for each row execute function public.set_updated_at();
create index milestones_contract_id_idx on public.milestones(contract_id);

-- contracts RLS
alter table public.contracts enable row level security;

create policy contracts_select_party on public.contracts
  for select to authenticated
  using (
    brand_id = (select auth.uid())
    or creator_id = (select auth.uid())
  );

create policy contracts_insert_brand on public.contracts
  for insert to authenticated
  with check (brand_id = (select auth.uid()));

create policy contracts_update_party on public.contracts
  for update to authenticated
  using (
    brand_id = (select auth.uid())
    or creator_id = (select auth.uid())
  )
  with check (
    brand_id = (select auth.uid())
    or creator_id = (select auth.uid())
  );

create policy contracts_delete_brand_draft on public.contracts
  for delete to authenticated
  using (brand_id = (select auth.uid()) and status = 'draft');

-- milestones RLS (gated through contract ownership)
alter table public.milestones enable row level security;

create policy milestones_select_party on public.milestones
  for select to authenticated
  using (
    exists (
      select 1 from public.contracts c
      where c.id = milestones.contract_id
        and (
          c.brand_id = (select auth.uid())
          or c.creator_id = (select auth.uid())
        )
    )
  );

create policy milestones_write_brand_draft on public.milestones
  for all to authenticated
  using (
    exists (
      select 1 from public.contracts c
      where c.id = milestones.contract_id
        and c.brand_id = (select auth.uid())
        and c.status = 'draft'
    )
  )
  with check (
    exists (
      select 1 from public.contracts c
      where c.id = milestones.contract_id
        and c.brand_id = (select auth.uid())
        and c.status = 'draft'
    )
  );
