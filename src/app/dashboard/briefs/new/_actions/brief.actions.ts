"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  briefBasicsSchema,
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

const draftBriefSchema = z.object({
  basics: briefBasicsSchema.pick({ title: true }).extend({
    objective: z.string().max(2000).optional().or(z.literal("")),
    niche: briefBasicsSchema.shape.niche.optional(),
  }),
  audience: completeBriefSchema.shape.audience.partial().optional(),
  deliverables: completeBriefSchema.shape.deliverables.partial().optional(),
  budget: completeBriefSchema.shape.budget.partial().optional(),
  terms: completeBriefSchema.shape.terms.optional(),
});

export type DraftBriefInput = z.infer<typeof draftBriefSchema>;

function mergeDraftPayload(
  input: DraftBriefInput,
  defaults: CompleteBriefInput,
): CompleteBriefInput {
  return {
    basics: {
      ...defaults.basics,
      ...input.basics,
      niche: input.basics.niche ?? defaults.basics.niche,
    },
    audience: { ...defaults.audience, ...input.audience },
    deliverables: {
      platforms:
        input.deliverables?.platforms ?? defaults.deliverables.platforms,
      deliverables:
        input.deliverables?.deliverables ?? defaults.deliverables.deliverables,
    },
    budget: { ...defaults.budget, ...input.budget },
    terms: { ...defaults.terms, ...input.terms },
  };
}

export async function saveBriefDraft(
  briefId: string | null,
  input: DraftBriefInput,
  defaults: CompleteBriefInput,
): Promise<BriefActionState> {
  const parsed = draftBriefSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const payload = mergeDraftPayload(parsed.data, defaults);
  if (briefId) return updateBriefDraft(briefId, payload);
  return insertBriefDraft(payload);
}

async function insertBriefDraft(
  payload: CompleteBriefInput,
): Promise<BriefActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { basics, audience, deliverables, budget, terms } = payload;

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

  if (error || !brief) return { error: error?.message ?? "Failed to save draft" };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/briefs");
  return { success: true, briefId: brief.id };
}

async function updateBriefDraft(
  briefId: string,
  payload: CompleteBriefInput,
): Promise<BriefActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { basics, audience, deliverables, budget, terms } = payload;

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
    .eq("brand_id", user.id)
    .eq("status", "draft");

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/briefs");
  revalidatePath(`/dashboard/briefs/${briefId}`);
  return { success: true, briefId };
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

export async function duplicateBrief(briefId: string): Promise<BriefActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: source } = await supabase
    .from("briefs")
    .select("*")
    .eq("id", briefId)
    .eq("brand_id", user.id)
    .maybeSingle();

  if (!source) return { error: "Brief not found." };

  const { data: copy, error } = await supabase
    .from("briefs")
    .insert({
      brand_id: user.id,
      title: `${source.title} (copy)`.slice(0, 200),
      objective: source.objective,
      niche: source.niche,
      target_audience: source.target_audience,
      platforms: source.platforms,
      deliverables: source.deliverables,
      budget_min_cents: source.budget_min_cents,
      budget_max_cents: source.budget_max_cents,
      currency: source.currency,
      exclusivity: source.exclusivity,
      usage_rights: source.usage_rights,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !copy) return { error: error?.message ?? "Failed to duplicate brief" };

  revalidatePath("/dashboard/briefs");
  redirect(`/dashboard/briefs/${copy.id}/edit`);
}
