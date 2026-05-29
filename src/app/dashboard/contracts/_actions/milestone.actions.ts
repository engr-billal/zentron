"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { recomputeAndSaveScore } from "@/lib/scoring/persist";
import { milestoneSubmissionSchema } from "@/lib/validations/milestone";

export type MilestoneActionState =
  | { error: string }
  | { success: true; milestoneId: string }
  | null;

async function loadMilestone(supabase: Awaited<ReturnType<typeof createClient>>, milestoneId: string) {
  return supabase
    .from("milestones")
    .select(
      "id, contract_id, status, contracts!inner(id, brand_id, creator_id, status)",
    )
    .eq("id", milestoneId)
    .maybeSingle();
}

function getContract(
  row: { contracts: unknown } | null,
): { id: string; brand_id: string; creator_id: string; status: string } | null {
  if (!row) return null;
  const c = Array.isArray(row.contracts) ? row.contracts[0] : row.contracts;
  if (!c || typeof c !== "object") return null;
  return c as {
    id: string;
    brand_id: string;
    creator_id: string;
    status: string;
  };
}

function revalidateContract(contractId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contracts");
  revalidatePath("/dashboard/campaigns");
  revalidatePath(`/dashboard/contracts/${contractId}`);
}

export async function submitMilestone(
  milestoneId: string,
  input: { notes?: string; urls?: string[] },
): Promise<MilestoneActionState> {
  const parsed = milestoneSubmissionSchema.safeParse({
    notes: input.notes ?? "",
    urls: input.urls ?? [],
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: row } = await loadMilestone(supabase, milestoneId);
  const contract = getContract(row);
  if (!row || !contract) return { error: "Milestone not found." };

  if (contract.creator_id !== user.id) {
    return { error: "Only the contract creator can submit deliverables." };
  }
  if (contract.status !== "active") {
    return { error: "Submissions are only allowed on active contracts." };
  }
  if (row.status !== "pending" && row.status !== "rejected") {
    return { error: "This milestone can't be submitted right now." };
  }

  const cleanUrls = parsed.data.urls
    .map((u) => u.trim())
    .filter((u) => u.length > 0);

  const { error } = await supabase
    .from("milestones")
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
      submission_notes: parsed.data.notes.trim() || null,
      submission_urls: cleanUrls,
      rejection_reason: null,
    })
    .eq("id", milestoneId);
  if (error) return { error: error.message };

  revalidateContract(contract.id);
  return { success: true, milestoneId };
}

export async function approveMilestone(
  milestoneId: string,
): Promise<MilestoneActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: row } = await loadMilestone(supabase, milestoneId);
  const contract = getContract(row);
  if (!row || !contract) return { error: "Milestone not found." };

  if (contract.brand_id !== user.id) {
    return { error: "Only the brand can approve milestones." };
  }
  if (contract.status !== "active") {
    return { error: "Only active contracts can have milestones approved." };
  }
  if (row.status !== "submitted") {
    return { error: "Milestone must be submitted before it can be approved." };
  }

  const { error } = await supabase
    .from("milestones")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      rejection_reason: null,
    })
    .eq("id", milestoneId);
  if (error) return { error: error.message };

  revalidateContract(contract.id);
  return { success: true, milestoneId };
}

export async function rejectMilestone(
  milestoneId: string,
  reason: string,
): Promise<MilestoneActionState> {
  const trimmed = reason.trim();
  if (trimmed.length < 5) {
    return { error: "Add a short reason so the creator knows what to fix." };
  }
  if (trimmed.length > 1000) {
    return { error: "Rejection reason is too long." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: row } = await loadMilestone(supabase, milestoneId);
  const contract = getContract(row);
  if (!row || !contract) return { error: "Milestone not found." };

  if (contract.brand_id !== user.id) {
    return { error: "Only the brand can reject milestones." };
  }
  if (contract.status !== "active") {
    return { error: "Only active contracts can have milestones rejected." };
  }
  if (row.status !== "submitted") {
    return { error: "Only submitted milestones can be rejected." };
  }

  const { error } = await supabase
    .from("milestones")
    .update({
      status: "rejected",
      rejection_reason: trimmed,
    })
    .eq("id", milestoneId);
  if (error) return { error: error.message };

  revalidateContract(contract.id);
  return { success: true, milestoneId };
}

export async function releaseMilestone(
  milestoneId: string,
): Promise<MilestoneActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: row } = await loadMilestone(supabase, milestoneId);
  const contract = getContract(row);
  if (!row || !contract) return { error: "Milestone not found." };

  if (contract.brand_id !== user.id) {
    return { error: "Only the brand can release milestones." };
  }
  if (contract.status !== "active") {
    return { error: "Only active contracts can release milestones." };
  }
  if (row.status !== "approved") {
    return { error: "Approve the milestone before releasing it." };
  }

  const { error } = await supabase
    .from("milestones")
    .update({
      status: "released",
      released_at: new Date().toISOString(),
    })
    .eq("id", milestoneId);
  if (error) return { error: error.message };

  // Auto-complete the contract once every milestone is released.
  const { data: remaining } = await supabase
    .from("milestones")
    .select("id, status")
    .eq("contract_id", contract.id);

  const allReleased =
    Array.isArray(remaining) &&
    remaining.length > 0 &&
    remaining.every((m) => m.status === "released");

  if (allReleased) {
    await supabase
      .from("contracts")
      .update({ status: "completed" })
      .eq("id", contract.id);
    await recomputeAndSaveScore(contract.creator_id);
  }

  revalidateContract(contract.id);
  return { success: true, milestoneId };
}
