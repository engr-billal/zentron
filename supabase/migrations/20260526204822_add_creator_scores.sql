create table public.creator_scores (
  creator_id uuid primary key references public.creator_profiles(id) on delete cascade,
  algo_version text not null default 'v0',
  audience_size_band audience_size_band not null,
  engagement_score int not null check (engagement_score between 0 and 100),
  niche_multiplier numeric(3,2) not null,
  niche_score int not null check (niche_score between 0 and 100),
  platform_score int not null check (platform_score between 0 and 100),
  track_record_score int not null check (track_record_score between 0 and 100),
  final_score int not null check (final_score between 0 and 100),
  suggested_min_cents int not null,
  suggested_max_cents int not null,
  currency text not null default 'USD',
  computed_at timestamptz not null default now()
);

create index creator_scores_final_score_idx
  on public.creator_scores(final_score desc);

alter table public.creator_scores enable row level security;

create policy creator_scores_select_authenticated on public.creator_scores
  for select to authenticated using (true);

create policy creator_scores_insert_own on public.creator_scores
  for insert to authenticated
  with check (creator_id = (select auth.uid()));

create policy creator_scores_update_own on public.creator_scores
  for update to authenticated
  using (creator_id = (select auth.uid()))
  with check (creator_id = (select auth.uid()));
