-- profiles
alter table public.profiles enable row level security;

create policy profiles_select_authenticated on public.profiles
  for select to authenticated using (true);

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- brand_profiles
alter table public.brand_profiles enable row level security;

create policy brand_profiles_select_authenticated on public.brand_profiles
  for select to authenticated using (true);

create policy brand_profiles_insert_own on public.brand_profiles
  for insert to authenticated
  with check (id = auth.uid());

create policy brand_profiles_update_own on public.brand_profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- creator_profiles
alter table public.creator_profiles enable row level security;

create policy creator_profiles_select_authenticated on public.creator_profiles
  for select to authenticated using (true);

create policy creator_profiles_insert_own on public.creator_profiles
  for insert to authenticated
  with check (id = auth.uid());

create policy creator_profiles_update_own on public.creator_profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- creator_platforms
alter table public.creator_platforms enable row level security;

create policy creator_platforms_select_authenticated on public.creator_platforms
  for select to authenticated using (true);

create policy creator_platforms_insert_own on public.creator_platforms
  for insert to authenticated
  with check (creator_id = auth.uid());

create policy creator_platforms_update_own on public.creator_platforms
  for update to authenticated
  using (creator_id = auth.uid())
  with check (creator_id = auth.uid());

create policy creator_platforms_delete_own on public.creator_platforms
  for delete to authenticated
  using (creator_id = auth.uid());

-- briefs
alter table public.briefs enable row level security;

create policy briefs_select_open_or_own on public.briefs
  for select to authenticated
  using (status = 'open' or brand_id = auth.uid());

create policy briefs_insert_own on public.briefs
  for insert to authenticated
  with check (brand_id = auth.uid());

create policy briefs_update_own on public.briefs
  for update to authenticated
  using (brand_id = auth.uid())
  with check (brand_id = auth.uid());

create policy briefs_delete_own on public.briefs
  for delete to authenticated
  using (brand_id = auth.uid());

-- brief_invitations
alter table public.brief_invitations enable row level security;

create policy brief_invitations_select_creator_or_brief_owner on public.brief_invitations
  for select to authenticated
  using (
    creator_id = auth.uid()
    or exists (
      select 1 from public.briefs b
      where b.id = brief_invitations.brief_id and b.brand_id = auth.uid()
    )
  );

create policy brief_invitations_insert_brief_owner on public.brief_invitations
  for insert to authenticated
  with check (
    exists (
      select 1 from public.briefs b
      where b.id = brief_invitations.brief_id and b.brand_id = auth.uid()
    )
  );

create policy brief_invitations_update_creator_or_brief_owner on public.brief_invitations
  for update to authenticated
  using (
    creator_id = auth.uid()
    or exists (
      select 1 from public.briefs b
      where b.id = brief_invitations.brief_id and b.brand_id = auth.uid()
    )
  )
  with check (
    creator_id = auth.uid()
    or exists (
      select 1 from public.briefs b
      where b.id = brief_invitations.brief_id and b.brand_id = auth.uid()
    )
  );
