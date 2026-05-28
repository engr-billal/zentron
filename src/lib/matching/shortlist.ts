import "server-only";

import { createClient } from "@/lib/supabase/server";
import { briefToFilters } from "./filters";
import { computeMatchScore } from "./score";
import type { Brief, MatchCandidate } from "./types";
import type { Database } from "@/types/database";

type CreatorPlatform = Database["public"]["Enums"]["creator_platform_type"];

const PLATFORM_VALUES = new Set<CreatorPlatform>([
  "instagram",
  "youtube",
  "tiktok",
  "podcast",
  "twitter",
  "linkedin",
]);

function isCreatorPlatform(v: string): v is CreatorPlatform {
  return PLATFORM_VALUES.has(v as CreatorPlatform);
}

const DEFAULT_LIMIT = 20;

export async function shortlistForBrief(
  brief: Brief,
  limit: number = DEFAULT_LIMIT,
): Promise<MatchCandidate[]> {
  const supabase = await createClient();
  const filters = briefToFilters(brief);

  let creatorsQuery = supabase
    .from("creator_profiles")
    .select("id, handle, bio, niches, primary_platform");

  if (filters.platforms.length > 0) {
    const allowed = filters.platforms.filter(isCreatorPlatform);
    if (allowed.length > 0) {
      creatorsQuery = creatorsQuery.in("primary_platform", allowed);
    }
  }
  if (filters.niche) {
    creatorsQuery = creatorsQuery.contains("niches", [filters.niche]);
  }

  const { data: creators } = await creatorsQuery.limit(limit * 3);

  if (!creators || creators.length === 0) return [];

  const creatorIds = creators.map((c) => c.id);

  const [{ data: profiles }, { data: platforms }, { data: scores }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", creatorIds),
      supabase
        .from("creator_platforms")
        .select("creator_id, platform, handle, followers, avg_engagement_rate")
        .in("creator_id", creatorIds),
      supabase
        .from("creator_scores")
        .select("creator_id, final_score, audience_size_band")
        .in("creator_id", creatorIds),
    ]);

  const candidates: MatchCandidate[] = creators.map((creator) => {
    const displayName =
      profiles?.find((p) => p.id === creator.id)?.display_name ?? null;

    const primaryPlatform =
      platforms?.find(
        (p) =>
          p.creator_id === creator.id &&
          p.platform === creator.primary_platform,
      ) ?? null;

    const score =
      scores?.find((s) => s.creator_id === creator.id) ?? null;

    const { matchScore, matchReasons } = computeMatchScore({
      filters,
      creator,
      primaryPlatform: primaryPlatform
        ? {
            platform: primaryPlatform.platform,
            handle: primaryPlatform.handle,
            followers: primaryPlatform.followers,
            avg_engagement_rate: primaryPlatform.avg_engagement_rate,
          }
        : null,
      score,
    });

    return {
      creator,
      displayName,
      primaryPlatform: primaryPlatform
        ? {
            platform: primaryPlatform.platform,
            handle: primaryPlatform.handle,
            followers: primaryPlatform.followers,
            avg_engagement_rate: primaryPlatform.avg_engagement_rate,
          }
        : null,
      score,
      matchScore,
      matchReasons,
    };
  });

  if (filters.audienceSizeBands.length > 0) {
    const requested = new Set(filters.audienceSizeBands);
    return candidates
      .filter(
        (c) => !c.score || requested.has(c.score.audience_size_band),
      )
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  return candidates
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

export async function countMatchesForBrief(brief: Brief): Promise<number> {
  const candidates = await shortlistForBrief(brief, 200);
  return candidates.length;
}
