-- Phase 5 lite — two-sided reviews on completed contracts.
-- A review captures one party's verdict on the other after a contract closes.
-- These power the Track Record dimension of the Zentron Score.

create table public.contract_reviews (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  reviewer_id uuid not null references auth.users(id) on delete cascade,
  reviewee_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (contract_id, reviewer_id)
);

create trigger contract_reviews_set_updated_at
  before update on public.contract_reviews
  for each row execute function public.set_updated_at();

create index contract_reviews_contract_idx on public.contract_reviews(contract_id);
create index contract_reviews_reviewee_idx on public.contract_reviews(reviewee_id);

alter table public.contract_reviews enable row level security;

-- Both parties on the contract can read each others' reviews.
create policy contract_reviews_select_party on public.contract_reviews
  for select to authenticated
  using (
    exists (
      select 1 from public.contracts c
      where c.id = contract_reviews.contract_id
        and (
          c.brand_id = (select auth.uid())
          or c.creator_id = (select auth.uid())
        )
    )
  );

-- Reviewer can insert iff: contract is completed, they are a party, and the
-- reviewee is the OTHER party. (DB doesn't enforce one-per-direction beyond
-- the unique constraint above; the action layer also blocks self-review.)
create policy contract_reviews_insert_party on public.contract_reviews
  for insert to authenticated
  with check (
    reviewer_id = (select auth.uid())
    and reviewer_id <> reviewee_id
    and exists (
      select 1 from public.contracts c
      where c.id = contract_reviews.contract_id
        and c.status = 'completed'
        and (
          (c.brand_id = (select auth.uid()) and c.creator_id = contract_reviews.reviewee_id)
          or (c.creator_id = (select auth.uid()) and c.brand_id = contract_reviews.reviewee_id)
        )
    )
  );

-- Reviewer can update or delete their own review.
create policy contract_reviews_update_self on public.contract_reviews
  for update to authenticated
  using (reviewer_id = (select auth.uid()))
  with check (reviewer_id = (select auth.uid()));

create policy contract_reviews_delete_self on public.contract_reviews
  for delete to authenticated
  using (reviewer_id = (select auth.uid()));
