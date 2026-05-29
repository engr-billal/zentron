-- Phase 4a: payment-free milestone lifecycle.
-- Add submission fields so creators can record deliverables and brand feedback,
-- then split active-contract update policies so each side owns its transitions.
-- No Stripe wiring: 'released' here just means "approved for payout" — Phase 4b
-- will add escrow holds and tie this to a real money movement.

alter table public.milestones
  add column if not exists submission_notes text,
  add column if not exists submission_urls text[] not null default '{}',
  add column if not exists rejection_reason text;

create policy milestones_update_creator_submit on public.milestones
  for update to authenticated
  using (
    exists (
      select 1 from public.contracts c
      where c.id = milestones.contract_id
        and c.creator_id = (select auth.uid())
        and c.status = 'active'
    )
  )
  with check (
    exists (
      select 1 from public.contracts c
      where c.id = milestones.contract_id
        and c.creator_id = (select auth.uid())
        and c.status = 'active'
    )
  );

create policy milestones_update_brand_active on public.milestones
  for update to authenticated
  using (
    exists (
      select 1 from public.contracts c
      where c.id = milestones.contract_id
        and c.brand_id = (select auth.uid())
        and c.status = 'active'
    )
  )
  with check (
    exists (
      select 1 from public.contracts c
      where c.id = milestones.contract_id
        and c.brand_id = (select auth.uid())
        and c.status = 'active'
    )
  );
