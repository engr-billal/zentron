import type { Database } from "@/types/database";

export const INDUSTRIES = [
  "D2C",
  "SaaS",
  "AI Tools",
  "Fintech",
  "Healthcare",
  "Beauty & Personal Care",
  "Fashion",
  "Food & Beverage",
  "Gaming",
  "Education",
  "Travel & Hospitality",
  "Media & Entertainment",
  "Other",
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const TEAM_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "200+",
] as const satisfies ReadonlyArray<
  Database["public"]["Enums"]["team_size"]
>;

export type TeamSize = (typeof TEAM_SIZES)[number];

export const TEAM_SIZE_LABELS: Record<TeamSize, string> = {
  "1-10": "1–10 people",
  "11-50": "11–50 people",
  "51-200": "51–200 people",
  "200+": "200+ people",
};

export const COMMON_AGE_RANGES = [
  { id: "18-24", label: "18–24", min: 18, max: 24 },
  { id: "25-34", label: "25–34", min: 25, max: 34 },
  { id: "35-44", label: "35–44", min: 35, max: 44 },
  { id: "45-54", label: "45–54", min: 45, max: 54 },
  { id: "55+", label: "55+", min: 55, max: 99 },
] as const;

export const AUDIENCE_SIZE_BANDS = [
  "nano",
  "micro",
  "mid",
  "macro",
  "mega",
] as const satisfies ReadonlyArray<
  Database["public"]["Enums"]["audience_size_band"]
>;

export const AUDIENCE_BAND_LABELS: Record<
  Database["public"]["Enums"]["audience_size_band"],
  string
> = {
  nano: "Nano (1K–10K)",
  micro: "Micro (10K–100K)",
  mid: "Mid (100K–500K)",
  macro: "Macro (500K–1M)",
  mega: "Mega (1M+)",
};

export const DELIVERABLE_TYPES = [
  "static_post",
  "carousel",
  "reel",
  "short_video",
  "long_video",
  "story",
  "podcast_segment",
  "podcast_episode",
  "newsletter",
  "blog_post",
] as const;

export type DeliverableType = (typeof DELIVERABLE_TYPES)[number];

export const DELIVERABLE_LABELS: Record<DeliverableType, string> = {
  static_post: "Static post",
  carousel: "Carousel",
  reel: "Reel",
  short_video: "Short video (<60s)",
  long_video: "Long video (>1min)",
  story: "Story",
  podcast_segment: "Podcast mention",
  podcast_episode: "Full podcast episode",
  newsletter: "Newsletter mention",
  blog_post: "Blog post",
};
