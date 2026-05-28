import { getAudienceBand } from "./audience-band";
import { getEngagementScore } from "./engagement-score";
import { getNicheResult } from "./niche-multiplier";
import { getPlatformResult } from "./platform-score";
import { getTrackRecordScore } from "./track-record";
import {
  ALGO_VERSION,
  DIMENSION_WEIGHTS,
  type ScoreInputs,
  type ScoreResult,
} from "./types";

export function computeZentronScore(input: ScoreInputs): ScoreResult {
  const audience = getAudienceBand(input.followers);
  const engagement = getEngagementScore(input.engagementRate);
  const niche = getNicheResult(input.niche);
  const platform = getPlatformResult(input.platform);
  const trackRecordScore = getTrackRecordScore(input);

  const finalScore = Math.round(
    audience.baseScore * DIMENSION_WEIGHTS.audienceSize +
      engagement.score * DIMENSION_WEIGHTS.engagement +
      niche.score * DIMENSION_WEIGHTS.niche +
      platform.score * DIMENSION_WEIGHTS.platform +
      trackRecordScore * DIMENSION_WEIGHTS.trackRecord,
  );

  const baseRateCents =
    audience.floorCents *
    engagement.multiplier *
    platform.multiplier *
    niche.multiplier;

  const suggestedMinCents = Math.round(baseRateCents * 0.85);
  const suggestedMaxCents = Math.round(baseRateCents * 1.35);

  return {
    algoVersion: ALGO_VERSION,
    audienceSizeBand: audience.band,
    engagementScore: engagement.score,
    nicheMultiplier: niche.multiplier,
    nicheScore: niche.score,
    platformScore: platform.score,
    trackRecordScore,
    finalScore: Math.max(0, Math.min(100, finalScore)),
    suggestedMinCents,
    suggestedMaxCents,
    currency: "USD",
  };
}
