-- Notifications feed for in-app alerts.

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_created_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy notifications_select_own on public.notifications
  for select to authenticated
  using (user_id = auth.uid());

create policy notifications_update_own on public.notifications
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy notifications_insert_authenticated on public.notifications
  for insert to authenticated
  with check (true);

-- Tokenized brief share links for creator invite-by-link.

create table public.brief_share_links (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references public.briefs (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  redeemed_by uuid references public.profiles (id) on delete set null,
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);

create index brief_share_links_brief_idx on public.brief_share_links (brief_id);
create index brief_share_links_token_idx on public.brief_share_links (token);

alter table public.brief_share_links enable row level security;

create policy brief_share_links_select_brand on public.brief_share_links
  for select to authenticated
  using (
    exists (
      select 1 from public.briefs b
      where b.id = brief_id and b.brand_id = auth.uid()
    )
    or token is not null
  );

create policy brief_share_links_insert_brand on public.brief_share_links
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and exists (
      select 1 from public.briefs b
      where b.id = brief_id and b.brand_id = auth.uid()
    )
  );

create policy brief_share_links_update_redeem on public.brief_share_links
  for update to authenticated
  using (expires_at > now() and redeemed_by is null)
  with check (redeemed_by = auth.uid());

-- Contact form messages from marketing site.

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy contact_messages_insert_public on public.contact_messages
  for insert to anon, authenticated
  with check (true);

create or replace function public.redeem_brief_share_link(p_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_link public.brief_share_links%rowtype;
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select * into v_link
  from public.brief_share_links
  where token = p_token
    and expires_at > now()
    and redeemed_by is null
  for update;

  if not found then
    raise exception 'invalid or expired link';
  end if;

  insert into public.brief_invitations (brief_id, creator_id, match_score, status)
  values (v_link.brief_id, v_uid, 0, 'invited')
  on conflict (brief_id, creator_id) do nothing;

  update public.brief_share_links
  set redeemed_by = v_uid, redeemed_at = now()
  where id = v_link.id;

  return v_link.brief_id;
end;
$$;

grant execute on function public.redeem_brief_share_link(text) to authenticated;
