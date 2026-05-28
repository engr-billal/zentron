import type { MatchCandidate, MatchFilters } from "./types";

export type ScoreInput = {
  filters: MatchFilters;
  creator: MatchCandidate["creator"];
  primaryPlatform: MatchCandidate["primaryPlatform"];
  score: MatchCandidate["score"];
};

export type ScoreOutput = {
  matchScore: number;
  matchReasons: string[];
};

export function computeMatchScore(input: ScoreInput): ScoreOutput {
  const { filters, creator, primaryPlatform, score } = input;
  const reasons: string[] = [];

  const baseScore = score?.final_score ?? 50;

  const nicheMatch =
    filters.niche && creator.niches.includes(filters.niche) ? 100 : 0;
  if (nicheMatch === 100) reasons.push(`Niche: ${filters.niche}`);

  const platformMatch = filters.platforms.includes(creator.primary_platform)
    ? 100
    : 50;
  if (platformMatch === 100) {
    reasons.push("Primary platform overlap");
  } else if (filters.platforms.length > 0) {
    reasons.push("Adjacent platform");
  }

  if (
    filters.audienceSizeBands.length > 0 &&
    score?.audience_size_band &&
    filters.audienceSizeBands.includes(score.audience_size_band)
  ) {
    reasons.push("Audience size match");
  }

  const matchScore = Math.round(
    baseScore * 0.6 + nicheMatch * 0.2 + platformMatch * 0.2,
  );

  if (
    primaryPlatform &&
    Number(primaryPlatform.avg_engagement_rate) >= 0.04
  ) {
    reasons.push("High engagement");
  }

  return {
    matchScore: Math.max(0, Math.min(100, matchScore)),
    matchReasons: reasons,
  };
}
