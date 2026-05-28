-- Persist the brand's typical targeting defaults so the brief creation wizard
-- can pre-fill niche, platforms, and audience-size bands per-brief. Per-brief
-- targeting still overrides on the briefs row.

alter table public.brand_profiles
  add column default_niches text[] not null default '{}',
  add column default_platforms text[] not null default '{}',
  add column default_audience_bands audience_size_band[] not null default '{}';
