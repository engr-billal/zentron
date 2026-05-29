"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { recomputeAndSaveScore } from "@/lib/scoring/persist";
import {
  completeContractSchema,
  type CompleteContractInput,
} from "@/lib/validations/contract";

export type ContractActionState =
  | { error: string }
  | { success: true; contractId: string }
  | null;

function emptyToNull(value: string | undefined | null): string | null {
  return value && value.length > 0 ? value : null;
}

export async function createContract(
  input: CompleteContractInput,
): Promise<ContractActionState> {
  const parsed = completeContractSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { brief_id, creator_id, scope, schedule, milestones, terms } =
    parsed.data;

  // Brand must own the brief
  const { data: brief } = await supabase
    .from("briefs")
    .select("brand_id")
    .eq("id", brief_id)
    .maybeSingle();
  if (!brief || brief.brand_id !== user.id) {
    return { error: "Brief not found or not yours." };
  }

  // Creator must have an opted_in invitation on this brief
  const { data: invitation } = await supabase
    .from("brief_invitations")
    .select("status")
    .eq("brief_id", brief_id)
    .eq("creator_id", creator_id)
    .maybeSingle();
  if (!invitation || invitation.status !== "opted_in") {
    return {
      error: "That creator has not opted in to this brief.",
    };
  }

  // Defensive recheck: milestone sum equals total fee
  const sum = milestones.milestones.reduce((s, m) => s + m.amount_cents, 0);
  if (sum !== schedule.total_fee_cents) {
    return {
      error: "Milestone amounts must add up to the total fee.",
    };
  }

  const { data: contract, error } = await supabase
    .from("contracts")
    .insert({
      brand_id: user.id,
      brief_id,
      creator_id,
      title: scope.title,
      scope: scope.scope,
      total_fee_cents: schedule.total_fee_cents,
      currency: schedule.currency,
      start_date: emptyToNull(schedule.start_date),
      end_date: emptyToNull(schedule.end_date),
      exclusivity: emptyToNull(terms.exclusivity),
      usage_rights: emptyToNull(terms.usage_rights),
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !contract) {
    return { error: error?.message ?? "Failed to create contract" };
  }

  const milestoneRows = milestones.milestones.map((m, i) => ({
    contract_id: contract.id,
    sequence: i + 1,
    title: m.title,
    description: emptyToNull(m.description),
    amount_cents: m.amount_cents,
    due_at: emptyToNull(m.due_at),
  }));
  const { error: msError } = await supabase
    .from("milestones")
    .insert(milestoneRows);
  if (msError) {
    return { error: msError.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contracts");
  revalidatePath(`/dashboard/briefs/${brief_id}`);
  redirect(`/dashboard/contracts/${contract.id}`);
}

export async function updateContract(
  contractId: string,
  input: CompleteContractInput,
): Promise<ContractActionState> {
  const parsed = completeContractSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: existing } = await supabase
    .from("contracts")
    .select("brand_id, status")
    .eq("id", contractId)
    .maybeSingle();
  if (!existing || existing.brand_id !== user.id) {
    return { error: "Contract not found or not yours." };
  }
  if (existing.status !== "draft") {
    return { error: "Only drafts can be edited." };
  }

  const { scope, schedule, milestones, terms } = parsed.data;

  const sum = milestones.milestones.reduce((s, m) => s + m.amount_cents, 0);
  if (sum !== schedule.total_fee_cents) {
    return { error: "Milestone amounts must add up to the total fee." };
  }

  const { error: updateError } = await supabase
    .from("contracts")
    .update({
      title: scope.title,
      scope: scope.scope,
      total_fee_cents: schedule.total_fee_cents,
      currency: schedule.currency,
      start_date: emptyToNull(schedule.start_date),
      end_date: emptyToNull(schedule.end_date),
      exclusivity: emptyToNull(terms.exclusivity),
      usage_rights: emptyToNull(terms.usage_rights),
    })
    .eq("id", contractId);
  if (updateError) return { error: updateError.message };

  const { error: delError } = await supabase
    .from("milestones")
    .delete()
    .eq("contract_id", contractId);
  if (delError) return { error: delError.message };

  const milestoneRows = milestones.milestones.map((m, i) => ({
    contract_id: contractId,
    sequence: i + 1,
    title: m.title,
    description: emptyToNull(m.description),
    amount_cents: m.amount_cents,
    due_at: emptyToNull(m.due_at),
  }));
  const { error: insError } = await supabase
    .from("milestones")
    .insert(milestoneRows);
  if (insError) return { error: insError.message };

  revalidatePath("/dashboard/contracts");
  revalidatePath(`/dashboard/contracts/${contractId}`);
  redirect(`/dashboard/contracts/${contractId}`);
}

export async function sendContract(
  contractId: string,
): Promise<ContractActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: contract } = await supabase
    .from("contracts")
    .select("brand_id, status")
    .eq("id", contractId)
    .maybeSingle();
  if (!contract || contract.brand_id !== user.id) {
    return { error: "Contract not found or not yours." };
  }
  if (contract.status !== "draft") {
    return { error: "Only drafts can be sent." };
  }

  const { error } = await supabase
    .from("contracts")
    .update({
      status: "pending_creator",
      signed_brand_at: new Date().toISOString(),
    })
    .eq("id", contractId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contracts");
  revalidatePath(`/dashboard/contracts/${contractId}`);
  return { success: true, contractId };
}

export async function signContract(
  contractId: string,
): Promise<ContractActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: contract } = await supabase
    .from("contracts")
    .select("creator_id, status")
    .eq("id", contractId)
    .maybeSingle();
  if (!contract || contract.creator_id !== user.id) {
    return { error: "Contract not found or not yours." };
  }
  if (contract.status !== "pending_creator") {
    return { error: "This contract isn't ready to sign." };
  }

  const { error } = await supabase
    .from("contracts")
    .update({
      status: "active",
      signed_creator_at: new Date().toISOString(),
    })
    .eq("id", contractId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contracts");
  revalidatePath(`/dashboard/contracts/${contractId}`);
  return { success: true, contractId };
}

export async function declineContract(
  contractId: string,
): Promise<ContractActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: contract } = await supabase
    .from("contracts")
    .select("creator_id, status")
    .eq("id", contractId)
    .maybeSingle();
  if (!contract || contract.creator_id !== user.id) {
    return { error: "Contract not found or not yours." };
  }
  if (contract.status !== "pending_creator") {
    return { error: "Only pending contracts can be declined." };
  }

  const { error } = await supabase
    .from("contracts")
    .update({ status: "declined" })
    .eq("id", contractId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contracts");
  revalidatePath(`/dashboard/contracts/${contractId}`);
  return { success: true, contractId };
}

export async function cancelContract(
  contractId: string,
  reason?: string,
): Promise<ContractActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: contract } = await supabase
    .from("contracts")
    .select("brand_id, creator_id, status")
    .eq("id", contractId)
    .maybeSingle();
  if (!contract) return { error: "Contract not found." };
  if (
    contract.brand_id !== user.id &&
    contract.creator_id !== user.id
  ) {
    return { error: "Not your contract." };
  }
  if (
    contract.status !== "pending_creator" &&
    contract.status !== "active"
  ) {
    return { error: "Only pending or active contracts can be cancelled." };
  }

  const { error } = await supabase
    .from("contracts")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      cancelled_reason: reason ?? null,
    })
    .eq("id", contractId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contracts");
  revalidatePath(`/dashboard/contracts/${contractId}`);
  return { success: true, contractId };
}

export async function markCompleted(
  contractId: string,
): Promise<ContractActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: contract } = await supabase
    .from("contracts")
    .select("brand_id, creator_id, status")
    .eq("id", contractId)
    .maybeSingle();
  if (!contract || contract.brand_id !== user.id) {
    return { error: "Contract not found or not yours." };
  }
  if (contract.status !== "active") {
    return { error: "Only active contracts can be marked complete." };
  }

  const { error } = await supabase
    .from("contracts")
    .update({ status: "completed" })
    .eq("id", contractId);
  if (error) return { error: error.message };

  await recomputeAndSaveScore(contract.creator_id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contracts");
  revalidatePath(`/dashboard/contracts/${contractId}`);
  return { success: true, contractId };
}

export async function deleteContract(
  contractId: string,
): Promise<ContractActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: contract } = await supabase
    .from("contracts")
    .select("brand_id, status, brief_id")
    .eq("id", contractId)
    .maybeSingle();
  if (!contract || contract.brand_id !== user.id) {
    return { error: "Contract not found or not yours." };
  }
  if (contract.status !== "draft") {
    return { error: "Only drafts can be deleted." };
  }

  const { error } = await supabase
    .from("contracts")
    .delete()
    .eq("id", contractId);
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/contracts");
  revalidatePath(`/dashboard/briefs/${contract.brief_id}`);
  redirect("/dashboard/contracts");
}
