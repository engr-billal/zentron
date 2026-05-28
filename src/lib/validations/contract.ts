import { z } from "zod";
import { CURRENCIES } from "@/lib/constants/creator";

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const contractScopeSchema = z.object({
  title: z.string().min(3).max(200),
  scope: z.string().min(20).max(5000),
});

export const contractScheduleSchema = z
  .object({
    total_fee_cents: z.coerce.number().int().min(0).max(1_000_000_000),
    currency: z.enum(CURRENCIES),
    start_date: dateOnly.optional().or(z.literal("")),
    end_date: dateOnly.optional().or(z.literal("")),
  })
  .refine(
    (v) =>
      !v.start_date ||
      !v.end_date ||
      v.start_date === "" ||
      v.end_date === "" ||
      v.end_date >= v.start_date,
    {
      message: "End date must be on or after start date",
      path: ["end_date"],
    },
  );

export const milestoneInputSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(1000).optional().or(z.literal("")),
  amount_cents: z.coerce.number().int().min(0),
  due_at: dateOnly.optional().or(z.literal("")),
});

export const contractMilestonesSchema = z.object({
  milestones: z.array(milestoneInputSchema).min(1).max(20),
});

export const contractTermsSchema = z.object({
  exclusivity: z.string().max(1000).optional().or(z.literal("")),
  usage_rights: z.string().max(1000).optional().or(z.literal("")),
});

export const completeContractSchema = z
  .object({
    brief_id: z.string().uuid(),
    creator_id: z.string().uuid(),
    scope: contractScopeSchema,
    schedule: contractScheduleSchema,
    milestones: contractMilestonesSchema,
    terms: contractTermsSchema,
  })
  .refine(
    (v) =>
      v.milestones.milestones.reduce((s, m) => s + m.amount_cents, 0) ===
      v.schedule.total_fee_cents,
    {
      message: "Milestone amounts must add up to the total fee",
      path: ["milestones"],
    },
  );

export type ContractScopeInput = z.infer<typeof contractScopeSchema>;
export type ContractScheduleInput = z.infer<typeof contractScheduleSchema>;
export type MilestoneInput = z.infer<typeof milestoneInputSchema>;
export type ContractMilestonesInput = z.infer<typeof contractMilestonesSchema>;
export type ContractTermsInput = z.infer<typeof contractTermsSchema>;
export type CompleteContractInput = z.infer<typeof completeContractSchema>;
