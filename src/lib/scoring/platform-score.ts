import type { Platform } from "./types";

export type PlatformResult = {
  score: number;
  multiplier: number;
};

const SCORES: Record<Platform, { score: number; multiplier: number }> = {
  youtube: { score: 95, multiplier: 1.4 },
  podcast: { score: 90, multiplier: 1.3 },
  tiktok: { score: 72, multiplier: 0.9 },
  instagram: { score: 78, multiplier: 1.0 },
  twitter: { score: 55, multiplier: 0.75 },
  linkedin: { score: 70, multiplier: 1.05 },
};

export function getPlatformResult(platform: Platform): PlatformResult {
  return SCORES[platform] ?? { score: 60, multiplier: 1.0 };
}
