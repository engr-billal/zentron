import { z } from "zod";
import {
  CREATOR_PLATFORM_TYPES,
  CURRENCIES,
  NICHES,
} from "@/lib/constants/creator";

const handleRegex = /^[a-z0-9_]{3,30}$/;

export const creatorIdentitySchema = z.object({
  handle: z
    .string()
    .regex(
      handleRegex,
      "Lowercase letters, numbers, underscores; 3–30 chars",
    ),
  country: z.string().length(2),
  languages: z.array(z.string().length(2)).min(1).max(5),
  bio: z.string().max(500).optional().or(z.literal("")),
});

export const creatorWorkSchema = z.object({
  niches: z.array(z.enum(NICHES)).min(1).max(3),
  primary_platform: z.enum(CREATOR_PLATFORM_TYPES),
  base_rate_cents: z.coerce
    .number()
    .int()
    .min(0)
    .max(1_000_000_000)
    .optional(),
  currency: z.enum(CURRENCIES).default("USD"),
});

export const creatorPlatformSchema = z.object({
  platform: z.enum(CREATOR_PLATFORM_TYPES),
  handle: z.string().min(1).max(100),
  followers: z.coerce.number().int().min(0),
  avg_engagement_rate: z.coerce.number().min(0).max(1),
  audience_health_score: z.coerce.number().min(0).max(100),
  verified: z.boolean().default(false),
});

export const completeCreatorOnboardingSchema = z.object({
  identity: creatorIdentitySchema,
  work: creatorWorkSchema,
  platforms: z.array(creatorPlatformSchema).min(1).max(6),
});

export const updateCreatorProfileSchema = creatorIdentitySchema.merge(
  creatorWorkSchema,
);

export type CreatorIdentityInput = z.infer<typeof creatorIdentitySchema>;
export type CreatorWorkInput = z.infer<typeof creatorWorkSchema>;
export type CreatorPlatformInput = z.infer<typeof creatorPlatformSchema>;
export type CompleteCreatorOnboardingInput = z.infer<
  typeof completeCreatorOnboardingSchema
>;
export type UpdateCreatorProfileInput = z.infer<
  typeof updateCreatorProfileSchema
>;
