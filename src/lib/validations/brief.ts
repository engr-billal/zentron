import { z } from "zod";
import {
  AUDIENCE_SIZE_BANDS,
  DELIVERABLE_TYPES,
} from "@/lib/constants/brand";
import {
  CREATOR_PLATFORM_TYPES,
  CURRENCIES,
  NICHES,
} from "@/lib/constants/creator";

export const briefBasicsSchema = z.object({
  title: z.string().min(3).max(200),
  objective: z.string().max(2000).optional().or(z.literal("")),
  niche: z.enum(NICHES),
});

export const briefAudienceSchema = z.object({
  countries: z.array(z.string().length(2)).max(20),
  age_min: z.coerce.number().int().min(13).max(99).optional(),
  age_max: z.coerce.number().int().min(13).max(99).optional(),
  audience_size_bands: z.array(z.enum(AUDIENCE_SIZE_BANDS)).max(5),
  interests: z.array(z.string().min(1).max(40)).max(10),
});

export const briefDeliverableSchema = z.object({
  type: z.enum(DELIVERABLE_TYPES),
  count: z.coerce.number().int().min(1).max(50),
  specs: z.string().max(500).optional().or(z.literal("")),
});

export const briefDeliverablesSchema = z.object({
  platforms: z.array(z.enum(CREATOR_PLATFORM_TYPES)).min(1).max(6),
  deliverables: z.array(briefDeliverableSchema).min(1).max(10),
});

export const briefBudgetSchema = z
  .object({
    budget_min_cents: z.coerce.number().int().min(0).optional(),
    budget_max_cents: z.coerce.number().int().min(0).optional(),
    currency: z.enum(CURRENCIES).default("USD"),
  })
  .refine(
    (v) =>
      v.budget_min_cents === undefined ||
      v.budget_max_cents === undefined ||
      v.budget_max_cents >= v.budget_min_cents,
    { message: "Max budget must be greater than or equal to min", path: ["budget_max_cents"] },
  );

export const briefTermsSchema = z.object({
  exclusivity: z.string().max(500).optional().or(z.literal("")),
  usage_rights: z.string().max(500).optional().or(z.literal("")),
});

export const completeBriefSchema = z.object({
  basics: briefBasicsSchema,
  audience: briefAudienceSchema,
  deliverables: briefDeliverablesSchema,
  budget: briefBudgetSchema,
  terms: briefTermsSchema,
});

export type BriefBasicsInput = z.infer<typeof briefBasicsSchema>;
export type BriefAudienceInput = z.infer<typeof briefAudienceSchema>;
export type BriefDeliverableInput = z.infer<typeof briefDeliverableSchema>;
export type BriefDeliverablesInput = z.infer<typeof briefDeliverablesSchema>;
export type BriefBudgetInput = z.infer<typeof briefBudgetSchema>;
export type BriefTermsInput = z.infer<typeof briefTermsSchema>;
export type CompleteBriefInput = z.infer<typeof completeBriefSchema>;

export type BriefTargetAudienceJson = {
  countries: string[];
  age_min: number | null;
  age_max: number | null;
  audience_size_bands: Array<
    (typeof AUDIENCE_SIZE_BANDS)[number]
  >;
  interests: string[];
};
