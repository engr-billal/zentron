import type { AudienceBand } from "./types";

export type AudienceBandResult = {
  band: AudienceBand;
  baseScore: number;
  floorCents: number;
};

const BANDS: Array<{
  band: AudienceBand;
  min: number;
  baseScore: number;
  floorCents: number;
}> = [
  { band: "mega", min: 1_000_000, baseScore: 95, floorCents: 4_000_000 },
  { band: "macro", min: 500_000, baseScore: 90, floorCents: 900_000 },
  { band: "mid", min: 100_000, baseScore: 82, floorCents: 250_000 },
  { band: "micro", min: 10_000, baseScore: 72, floorCents: 60_000 },
  { band: "nano", min: 0, baseScore: 60, floorCents: 15_000 },
];

export function getAudienceBand(followers: number): AudienceBandResult {
  const safeFollowers = Math.max(0, Math.floor(followers));
  for (const tier of BANDS) {
    if (safeFollowers >= tier.min) {
      return {
        band: tier.band,
        baseScore: tier.baseScore,
        floorCents: tier.floorCents,
      };
    }
  }
  const last = BANDS[BANDS.length - 1];
  return { band: last.band, baseScore: last.baseScore, floorCents: last.floorCents };
}
