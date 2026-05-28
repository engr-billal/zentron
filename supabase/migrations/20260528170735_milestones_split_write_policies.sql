-- Advisor fix: the FOR ALL policy created earlier overlaps with the SELECT
-- policy, forcing RLS to evaluate two permissive policies on every SELECT.
-- Split write access into discrete INSERT / UPDATE / DELETE policies so the
-- SELECT path only checks one policy.

drop policy milestones_write_brand_draft on public.milestones;

create policy milestones_insert_brand_draft on public.milestones
  for insert to authenticated
  with check (
    exists (
      select 1 from public.contracts c
      where c.id = milestones.contract_id
        and c.brand_id = (select auth.uid())
        and c.status = 'draft'
    )
  );

create policy milestones_update_brand_draft on public.milestones
  for update to authenticated
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

create policy milestones_delete_brand_draft on public.milestones
  for delete to authenticated
  using (
    exists (
      select 1 from public.contracts c
      where c.id = milestones.contract_id
        and c.brand_id = (select auth.uid())
        and c.status = 'draft'
    )
  );
