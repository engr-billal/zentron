export type TrackRecordInputs = {
  completedCampaigns?: number;
  onTimeRate?: number;
  onBriefRate?: number;
  avgRating?: number;
  disputeCount?: number;
};

const BASE_SCORE_NEW_CREATOR = 50;

export function getTrackRecordScore(input: TrackRecordInputs): number {
  const completed = input.completedCampaigns ?? 0;

  if (completed === 0) return BASE_SCORE_NEW_CREATOR;

  const onTimeBonus = (input.onTimeRate ?? 0) * 20;
  const onBriefBonus = (input.onBriefRate ?? 0) * 15;
  const ratingBonus = ((input.avgRating ?? 0) / 5) * 15;
  const disputePenalty = Math.min(30, (input.disputeCount ?? 0) * 10);

  const score =
    BASE_SCORE_NEW_CREATOR +
    onTimeBonus +
    onBriefBonus +
    ratingBonus -
    disputePenalty;

  return Math.max(0, Math.min(100, Math.round(score)));
}
