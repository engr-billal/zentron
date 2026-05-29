-- Phase 1.1 — public waitlist capture for the marketing site.
-- Anonymous visitors should be able to insert their email + role intent.
-- No reads from the public; only service role / authenticated admins.

create type waitlist_role_intent as enum ('brand', 'creator', 'either');

create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role_intent waitlist_role_intent not null default 'either',
  source text,
  created_at timestamptz not null default now()
);

create unique index waitlist_email_lower_idx
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

create policy waitlist_insert_public on public.waitlist
  for insert to anon, authenticated
  with check (true);
