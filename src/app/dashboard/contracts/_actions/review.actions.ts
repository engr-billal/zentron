"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { recomputeAndSaveScore } from "@/lib/scoring/persist";

export type ReviewActionState =
  | { error: string }
  | { success: true; reviewId: string }
  | null;

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  body: z
    .string()
    .trim()
    .max(2000, "Keep your review under 2000 characters")
    .optional()
    .default(""),
});

export async function submitContractReview(
  contractId: string,
  input: { rating: number | string; body?: string },
): Promise<ReviewActionState> {
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid review" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: contract } = await supabase
    .from("contracts")
    .select("id, brand_id, creator_id, status")
    .eq("id", contractId)
    .maybeSingle();
  if (!contract) return { error: "Contract not found." };
  if (contract.status !== "completed") {
    return { error: "Reviews open once the contract is completed." };
  }

  const isBrand = contract.brand_id === user.id;
  const isCreator = contract.creator_id === user.id;
  if (!isBrand && !isCreator) return { error: "Not your contract." };

  const revieweeId = isBrand ? contract.creator_id : contract.brand_id;

  const { data: review, error } = await supabase
    .from("contract_reviews")
    .insert({
      contract_id: contract.id,
      reviewer_id: user.id,
      reviewee_id: revieweeId,
      rating: parsed.data.rating,
      body: parsed.data.body.trim() || null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "You already reviewed this contract." };
    }
    return { error: error.message };
  }

  // If the brand reviewed the creator, recompute the creator's score so the
  // new completed campaign + rating feeds Track Record.
  if (isBrand) {
    await recomputeAndSaveScore(contract.creator_id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contracts");
  revalidatePath(`/dashboard/contracts/${contractId}`);
  return { success: true, reviewId: review.id };
}
