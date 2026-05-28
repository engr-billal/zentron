"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { creatorPlatformSchema } from "@/lib/validations/creator";
import { recomputeAndSaveScore } from "@/lib/scoring/persist";

export type PlatformActionState = { error: string } | null;

function parseFormData(formData: FormData) {
  return {
    platform: formData.get("platform"),
    handle: formData.get("handle"),
    followers: Number(formData.get("followers") ?? 0),
    avg_engagement_rate: Number(formData.get("avg_engagement_rate") ?? 0),
    audience_health_score: Number(formData.get("audience_health_score") ?? 0),
    verified: formData.get("verified") === "on",
  };
}

export async function addPlatform(
  _prev: PlatformActionState,
  formData: FormData,
): Promise<PlatformActionState> {
  const parsed = creatorPlatformSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase.from("creator_platforms").insert({
    creator_id: user.id,
    ...parsed.data,
  });
  if (error) {
    if (error.code === "23505") {
      return { error: "You already have a row for that platform." };
    }
    return { error: error.message };
  }

  const scoreError = await recomputeAndSaveScore(user.id);
  if (scoreError) return { error: scoreError };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/platforms");
  return null;
}

export async function updatePlatform(
  platformId: string,
  _prev: PlatformActionState,
  formData: FormData,
): Promise<PlatformActionState> {
  const parsed = creatorPlatformSchema.safeParse(parseFormData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("creator_platforms")
    .update(parsed.data)
    .eq("id", platformId)
    .eq("creator_id", user.id);

  if (error) return { error: error.message };

  const scoreError = await recomputeAndSaveScore(user.id);
  if (scoreError) return { error: scoreError };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/platforms");
  return null;
}

export async function deletePlatform(
  platformId: string,
): Promise<PlatformActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("creator_platforms")
    .delete()
    .eq("id", platformId)
    .eq("creator_id", user.id);

  if (error) return { error: error.message };

  const scoreError = await recomputeAndSaveScore(user.id);
  if (scoreError) {
    // Not fatal — the row is deleted; just skip the recompute notice.
    return null;
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/platforms");
  return null;
}
