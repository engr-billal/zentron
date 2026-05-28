import { z } from "zod";
import {
  AUDIENCE_SIZE_BANDS,
  INDUSTRIES,
  TEAM_SIZES,
} from "@/lib/constants/brand";
import {
  CREATOR_PLATFORM_TYPES,
  CURRENCIES,
  NICHES,
} from "@/lib/constants/creator";

export const brandCompanySchema = z.object({
  company_name: z.string().min(1).max(200),
  website: z
    .string()
    .url("Enter a valid URL like https://example.com")
    .optional()
    .or(z.literal("")),
  industry: z.enum(INDUSTRIES),
  team_size: z.enum(TEAM_SIZES),
});

export const brandTargetingSchema = z.object({
  default_niches: z.array(z.enum(NICHES)).max(5),
  default_platforms: z.array(z.enum(CREATOR_PLATFORM_TYPES)).max(6),
  default_audience_bands: z.array(z.enum(AUDIENCE_SIZE_BANDS)).max(5),
});

export const brandBillingSchema = z.object({
  billing_country: z.string().length(2),
  currency: z.enum(CURRENCIES).default("USD"),
});

export const completeBrandOnboardingSchema = z.object({
  company: brandCompanySchema,
  targeting: brandTargetingSchema,
  billing: brandBillingSchema,
});

export type BrandCompanyInput = z.infer<typeof brandCompanySchema>;
export type BrandTargetingInput = z.infer<typeof brandTargetingSchema>;
export type BrandBillingInput = z.infer<typeof brandBillingSchema>;
export type CompleteBrandOnboardingInput = z.infer<
  typeof completeBrandOnboardingSchema
>;
