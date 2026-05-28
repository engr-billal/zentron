import type { Database } from "@/types/database";

export type Platform = Database["public"]["Enums"]["creator_platform_type"];
export type AudienceBand = Database["public"]["Enums"]["audience_size_band"];

export type Niche =
  | "finance"
  | "b2b_tech"
  | "beauty"
  | "lifestyle"
  | "fitness"
  | "food"
  | "travel"
  | "gaming"
  | "education"
  | "other";

export type ScoreInputs = {
  followers: number;
  engagementRate: number;
  niche: Niche;
  platform: Platform;
  completedCampaigns?: number;
  onTimeRate?: number;
  onBriefRate?: number;
  avgRating?: number;
  disputeCount?: number;
};

export type ScoreResult = {
  algoVersion: "v0";
  audienceSizeBand: AudienceBand;
  engagementScore: number;
  nicheMultiplier: number;
  nicheScore: number;
  platformScore: number;
  trackRecordScore: number;
  finalScore: number;
  suggestedMinCents: number;
  suggestedMaxCents: number;
  currency: "USD";
};

export const ALGO_VERSION = "v0" as const;

export const DIMENSION_WEIGHTS = {
  audienceSize: 0.2,
  engagement: 0.25,
  niche: 0.2,
  platform: 0.15,
  trackRecord: 0.2,
} as const;
