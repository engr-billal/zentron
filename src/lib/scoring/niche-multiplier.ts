import type { Niche } from "./types";

export type NicheResult = {
  multiplier: number;
  score: number;
};

const MULTIPLIERS: Record<Niche, number> = {
  finance: 3.0,
  b2b_tech: 2.5,
  beauty: 1.5,
  lifestyle: 1.0,
  fitness: 1.2,
  food: 1.1,
  travel: 1.15,
  gaming: 1.3,
  education: 1.4,
  other: 1.0,
};

export function getNicheResult(niche: Niche): NicheResult {
  const multiplier = MULTIPLIERS[niche] ?? 1.0;
  const score = Math.min(100, Math.round(50 * multiplier));
  return { multiplier, score };
}
