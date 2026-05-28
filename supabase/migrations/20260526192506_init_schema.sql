-- Enums
create type user_role as enum ('brand', 'creator', 'admin');
create type creator_platform_type as enum ('instagram', 'youtube', 'tiktok', 'podcast', 'twitter', 'linkedin');
create type brief_status as enum ('draft', 'open', 'closed');
create type invitation_status as enum ('invited', 'opted_in', 'declined', 'expired');
create type audience_size_band as enum ('nano', 'micro', 'mid', 'macro', 'mega');
create type subscription_tier as enum ('free', 'scale');
create type team_size as enum ('1-10', '11-50', '51-200', '200+');

-- Shared updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role,
  display_name text,
  avatar_url text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- brand_profiles
create table public.brand_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  company_name text not null,
  website text,
  industry text,
  team_size team_size,
  logo_url text,
  billing_country text,
  subscription_tier subscription_tier not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger brand_profiles_set_updated_at
  before update on public.brand_profiles
  for each row execute function public.set_updated_at();

-- creator_profiles
create table public.creator_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  handle text not null unique,
  primary_platform creator_platform_type not null,
  niches text[] not null default '{}',
  languages text[] not null default '{}',
  bio text,
  base_rate_cents integer,
  currency text default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger creator_profiles_set_updated_at
  before update on public.creator_profiles
  for each row execute function public.set_updated_at();
create index creator_profiles_primary_platform_idx on public.creator_profiles(primary_platform);

-- creator_platforms
create table public.creator_platforms (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creator_profiles(id) on delete cascade,
  platform creator_platform_type not null,
  handle text not null,
  followers integer not null default 0,
  avg_engagement_rate numeric(6,4) not null default 0,
  audience_health_score numeric(5,2) not null default 0,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (creator_id, platform)
);
create trigger creator_platforms_set_updated_at
  before update on public.creator_platforms
  for each row execute function public.set_updated_at();
create index creator_platforms_creator_id_idx on public.creator_platforms(creator_id);

-- briefs
create table public.briefs (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brand_profiles(id) on delete cascade,
  title text not null,
  objective text,
  target_audience jsonb not null default '{}'::jsonb,
  niche text,
  platforms text[] not null default '{}',
  deliverables jsonb not null default '[]'::jsonb,
  budget_min_cents integer,
  budget_max_cents integer,
  currency text default 'USD',
  exclusivity text,
  usage_rights text,
  status brief_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger briefs_set_updated_at
  before update on public.briefs
  for each row execute function public.set_updated_at();
create index briefs_status_brand_idx on public.briefs(status, brand_id);

-- brief_invitations
create table public.brief_invitations (
  brief_id uuid not null references public.briefs(id) on delete cascade,
  creator_id uuid not null references public.creator_profiles(id) on delete cascade,
  match_score integer not null check (match_score >= 0 and match_score <= 100),
  status invitation_status not null default 'invited',
  invited_at timestamptz not null default now(),
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (brief_id, creator_id)
);
create trigger brief_invitations_set_updated_at
  before update on public.brief_invitations
  for each row execute function public.set_updated_at();
create index brief_invitations_creator_status_idx on public.brief_invitations(creator_id, status);
