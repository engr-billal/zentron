import type { Brief, MatchFilters } from "./types";
import type { BriefTargetAudienceJson } from "@/lib/validations/brief";

export function briefToFilters(brief: Brief): MatchFilters {
  const targeting = (brief.target_audience ?? {}) as Partial<BriefTargetAudienceJson>;
  return {
    niche: brief.niche ?? "",
    platforms: brief.platforms ?? [],
    audienceSizeBands: targeting.audience_size_bands ?? [],
  };
}
