import "server-only";

import { createClient } from "@/lib/supabase/server";
import { computeZentronScore } from "./zentron-score";
import type { Niche, Platform } from "./types";

function platformToNiche(value: string | null): Niche {
  switch (value) {
    case "finance":
    case "b2b_tech":
    case "beauty":
    case "lifestyle":
    case "fitness":
    case "food":
    case "travel":
    case "gaming":
    case "education":
      return value;
    default:
      return "other";
  }
}

export async function recomputeAndSaveScore(
  creatorId: string,
): Promise<string | null> {
  const supabase = await createClient();

  const { data: creator, error: creatorError } = await supabase
    .from("creator_profiles")
    .select("id, niches, primary_platform")
    .eq("id", creatorId)
    .maybeSingle();

  if (creatorError) return creatorError.message;
  if (!creator) return "Creator profile not found.";

  const { data: primaryPlatform, error: platformError } = await supabase
    .from("creator_platforms")
    .select("followers, avg_engagement_rate")
    .eq("creator_id", creatorId)
    .eq("platform", creator.primary_platform)
    .maybeSingle();

  if (platformError) return platformError.message;
  if (!primaryPlatform) {
    return "Add a row for your primary platform to compute a score.";
  }

  const niche = platformToNiche(creator.niches?.[0] ?? null);
  const platform = creator.primary_platform as Platform;

  const result = computeZentronScore({
    followers: primaryPlatform.followers,
    engagementRate: Number(primaryPlatform.avg_engagement_rate),
    niche,
    platform,
  });

  const { error: upsertError } = await supabase.from("creator_scores").upsert({
    creator_id: creatorId,
    algo_version: result.algoVersion,
    audience_size_band: result.audienceSizeBand,
    engagement_score: result.engagementScore,
    niche_multiplier: result.nicheMultiplier,
    niche_score: result.nicheScore,
    platform_score: result.platformScore,
    track_record_score: result.trackRecordScore,
    final_score: result.finalScore,
    suggested_min_cents: result.suggestedMinCents,
    suggested_max_cents: result.suggestedMaxCents,
    currency: result.currency,
  });

  if (upsertError) return upsertError.message;
  return null;
}
