-- Fix function_search_path_mutable on set_updated_at
alter function public.set_updated_at() set search_path = '';

-- Cover the briefs.brand_id foreign key for fast joins
create index briefs_brand_id_idx on public.briefs(brand_id);

-- Recreate all RLS policies wrapping auth.uid() in (select auth.uid())
-- so it's evaluated once per query instead of once per row.

-- profiles
drop policy profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- brand_profiles
drop policy brand_profiles_insert_own on public.brand_profiles;
drop policy brand_profiles_update_own on public.brand_profiles;
create policy brand_profiles_insert_own on public.brand_profiles
  for insert to authenticated
  with check (id = (select auth.uid()));
create policy brand_profiles_update_own on public.brand_profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- creator_profiles
drop policy creator_profiles_insert_own on public.creator_profiles;
drop policy creator_profiles_update_own on public.creator_profiles;
create policy creator_profiles_insert_own on public.creator_profiles
  for insert to authenticated
  with check (id = (select auth.uid()));
create policy creator_profiles_update_own on public.creator_profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- creator_platforms
drop policy creator_platforms_insert_own on public.creator_platforms;
drop policy creator_platforms_update_own on public.creator_platforms;
drop policy creator_platforms_delete_own on public.creator_platforms;
create policy creator_platforms_insert_own on public.creator_platforms
  for insert to authenticated
  with check (creator_id = (select auth.uid()));
create policy creator_platforms_update_own on public.creator_platforms
  for update to authenticated
  using (creator_id = (select auth.uid()))
  with check (creator_id = (select auth.uid()));
create policy creator_platforms_delete_own on public.creator_platforms
  for delete to authenticated
  using (creator_id = (select auth.uid()));

-- briefs
drop policy briefs_select_open_or_own on public.briefs;
drop policy briefs_insert_own on public.briefs;
drop policy briefs_update_own on public.briefs;
drop policy briefs_delete_own on public.briefs;
create policy briefs_select_open_or_own on public.briefs
  for select to authenticated
  using (status = 'open' or brand_id = (select auth.uid()));
create policy briefs_insert_own on public.briefs
  for insert to authenticated
  with check (brand_id = (select auth.uid()));
create policy briefs_update_own on public.briefs
  for update to authenticated
  using (brand_id = (select auth.uid()))
  with check (brand_id = (select auth.uid()));
create policy briefs_delete_own on public.briefs
  for delete to authenticated
  using (brand_id = (select auth.uid()));

-- brief_invitations
drop policy brief_invitations_select_creator_or_brief_owner on public.brief_invitations;
drop policy brief_invitations_insert_brief_owner on public.brief_invitations;
drop policy brief_invitations_update_creator_or_brief_owner on public.brief_invitations;
create policy brief_invitations_select_creator_or_brief_owner on public.brief_invitations
  for select to authenticated
  using (
    creator_id = (select auth.uid())
    or exists (
      select 1 from public.briefs b
      where b.id = brief_invitations.brief_id and b.brand_id = (select auth.uid())
    )
  );
create policy brief_invitations_insert_brief_owner on public.brief_invitations
  for insert to authenticated
  with check (
    exists (
      select 1 from public.briefs b
      where b.id = brief_invitations.brief_id and b.brand_id = (select auth.uid())
    )
  );
create policy brief_invitations_update_creator_or_brief_owner on public.brief_invitations
  for update to authenticated
  using (
    creator_id = (select auth.uid())
    or exists (
      select 1 from public.briefs b
      where b.id = brief_invitations.brief_id and b.brand_id = (select auth.uid())
    )
  )
  with check (
    creator_id = (select auth.uid())
    or exists (
      select 1 from public.briefs b
      where b.id = brief_invitations.brief_id and b.brand_id = (select auth.uid())
    )
  );
