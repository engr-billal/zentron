import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(500, "URL is too long")
  .refine(
    (v) => v.length === 0 || /^https?:\/\//i.test(v),
    "URLs must start with http:// or https://",
  );

export const milestoneSubmissionSchema = z.object({
  notes: z
    .string()
    .max(2000, "Notes are too long")
    .default(""),
  urls: z.array(optionalUrl).max(10, "Up to 10 links per submission"),
});

export type MilestoneSubmissionInput = z.infer<
  typeof milestoneSubmissionSchema
>;
