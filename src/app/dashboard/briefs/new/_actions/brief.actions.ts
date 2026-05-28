"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  completeBriefSchema,
  type BriefTargetAudienceJson,
  type CompleteBriefInput,
} from "@/lib/validations/brief";
import type { Json } from "@/types/database";

export type BriefActionState =
  | { error: string }
  | { success: true; briefId: string }
  | null;

function toTargetAudienceJson(
  input: CompleteBriefInput["audience"],
): Json {
  const json: BriefTargetAudienceJson = {
    countries: input.countries,
    age_min: input.age_min ?? null,
    age_max: input.age_max ?? null,
    audience_size_bands: input.audience_size_bands,
    interests: input.interests,
  };
  return json as unknown as Json;
}

function toDeliverablesJson(
  input: CompleteBriefInput["deliverables"]["deliverables"],
): Json {
  return input as unknown as Json;
}

export async function createBrief(
  input: CompleteBriefInput,
): Promise<BriefActionState> {
  const parsed = completeBriefSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { basics, audience, deliverables, budget, terms } = parsed.data;

  const { data: brief, error } = await supabase
    .from("briefs")
    .insert({
      brand_id: user.id,
      title: basics.title,
      objective: basics.objective || null,
      niche: basics.niche,
      target_audience: toTargetAudienceJson(audience),
      platforms: deliverables.platforms,
      deliverables: toDeliverablesJson(deliverables.deliverables),
      budget_min_cents: budget.budget_min_cents ?? null,
      budget_max_cents: budget.budget_max_cents ?? null,
      currency: budget.currency,
      exclusivity: terms.exclusivity || null,
      usage_rights: terms.usage_rights || null,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !brief) return { error: error?.message ?? "Failed to create brief" };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/briefs");
  redirect(`/dashboard/briefs/${brief.id}`);
}

export async function updateBrief(
  briefId: string,
  input: CompleteBriefInput,
): Promise<BriefActionState> {
  const parsed = completeBriefSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { basics, audience, deliverables, budget, terms } = parsed.data;

  const { error } = await supabase
    .from("briefs")
    .update({
      title: basics.title,
      objective: basics.objective || null,
      niche: basics.niche,
      target_audience: toTargetAudienceJson(audience),
      platforms: deliverables.platforms,
      deliverables: toDeliverablesJson(deliverables.deliverables),
      budget_min_cents: budget.budget_min_cents ?? null,
      budget_max_cents: budget.budget_max_cents ?? null,
      currency: budget.currency,
      exclusivity: terms.exclusivity || null,
      usage_rights: terms.usage_rights || null,
    })
    .eq("id", briefId)
    .eq("brand_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/briefs");
  revalidatePath(`/dashboard/briefs/${briefId}`);
  redirect(`/dashboard/briefs/${briefId}`);
}

export async function publishBrief(briefId: string): Promise<BriefActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("briefs")
    .update({ status: "open" })
    .eq("id", briefId)
    .eq("brand_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/briefs");
  revalidatePath(`/dashboard/briefs/${briefId}`);
  return { success: true, briefId };
}

export async function closeBrief(briefId: string): Promise<BriefActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("briefs")
    .update({ status: "closed" })
    .eq("id", briefId)
    .eq("brand_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/briefs");
  revalidatePath(`/dashboard/briefs/${briefId}`);
  return { success: true, briefId };
}

export async function reopenBrief(briefId: string): Promise<BriefActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("briefs")
    .update({ status: "open" })
    .eq("id", briefId)
    .eq("brand_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/briefs");
  revalidatePath(`/dashboard/briefs/${briefId}`);
  return { success: true, briefId };
}

export async function deleteBrief(briefId: string): Promise<BriefActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("briefs")
    .delete()
    .eq("id", briefId)
    .eq("brand_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/briefs");
  redirect("/dashboard/briefs");
}
