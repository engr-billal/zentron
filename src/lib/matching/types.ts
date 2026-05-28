import type { Tables } from "@/types/database";

export type Brief = Tables<"briefs">;

export type MatchCandidate = {
  creator: Pick<
    Tables<"creator_profiles">,
    "id" | "handle" | "bio" | "niches" | "primary_platform"
  >;
  displayName: string | null;
  primaryPlatform: Pick<
    Tables<"creator_platforms">,
    "platform" | "handle" | "followers" | "avg_engagement_rate"
  > | null;
  score: Pick<
    Tables<"creator_scores">,
    "final_score" | "audience_size_band"
  > | null;
  matchScore: number;
  matchReasons: string[];
};

export type MatchFilters = {
  niche: string;
  platforms: string[];
  audienceSizeBands: string[];
};
