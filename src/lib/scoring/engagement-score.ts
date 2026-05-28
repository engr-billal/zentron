export type EngagementResult = {
  score: number;
  multiplier: number;
};

const TIERS: Array<{ max: number; score: number }> = [
  { max: 0.005, score: 30 },
  { max: 0.01, score: 50 },
  { max: 0.02, score: 70 },
  { max: 0.04, score: 85 },
  { max: 0.08, score: 92 },
  { max: Infinity, score: 96 },
];

export function getEngagementScore(engagementRate: number): EngagementResult {
  const rate = Math.max(0, Math.min(1, engagementRate));

  let score = 30;
  for (const tier of TIERS) {
    if (rate < tier.max) {
      score = tier.score;
      break;
    }
  }

  const multiplier = clamp(0.7 + (rate / 0.08) * 0.9, 0.7, 1.6);
  return { score, multiplier };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
