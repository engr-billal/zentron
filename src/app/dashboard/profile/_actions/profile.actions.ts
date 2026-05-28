"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { recomputeAndSaveScore } from "@/lib/scoring/persist";
import { updateCreatorProfileSchema } from "@/lib/validations/creator";

export type ProfileActionState = { error: string } | { success: true } | null;

export async function updateCreatorProfile(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const raw = {
    handle: formData.get("handle"),
    country: formData.get("country"),
    languages: formData.getAll("languages"),
    bio: formData.get("bio"),
    niches: formData.getAll("niches"),
    primary_platform: formData.get("primary_platform"),
    base_rate_cents: formData.get("base_rate_cents") || undefined,
    currency: formData.get("currency"),
  };

  const parsed = updateCreatorProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error: creatorError } = await supabase
    .from("creator_profiles")
    .update({
      handle: parsed.data.handle,
      bio: parsed.data.bio || null,
      languages: parsed.data.languages,
      niches: parsed.data.niches,
      primary_platform: parsed.data.primary_platform,
      base_rate_cents: parsed.data.base_rate_cents ?? null,
      currency: parsed.data.currency,
    })
    .eq("id", user.id);

  if (creatorError) {
    if (creatorError.code === "23505") {
      return { error: "That handle is already taken." };
    }
    return { error: creatorError.message };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ country: parsed.data.country })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  const scoreError = await recomputeAndSaveScore(user.id);
  if (scoreError) return { error: scoreError };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  redirect("/dashboard");
}
