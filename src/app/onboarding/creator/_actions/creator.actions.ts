"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  completeCreatorOnboardingSchema,
  type CompleteCreatorOnboardingInput,
} from "@/lib/validations/creator";
import { recomputeAndSaveScore } from "@/lib/scoring/persist";

export type CreatorActionState = { error: string } | null;

export async function completeCreatorOnboarding(
  input: CompleteCreatorOnboardingInput,
): Promise<CreatorActionState> {
  const parsed = completeCreatorOnboardingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { identity, work, platforms } = parsed.data;

  const { error: profileError } = await supabase
    .from("creator_profiles")
    .insert({
      id: user.id,
      handle: identity.handle,
      bio: identity.bio || null,
      languages: identity.languages,
      niches: work.niches,
      primary_platform: work.primary_platform,
      base_rate_cents: work.base_rate_cents ?? null,
      currency: work.currency,
    });
  if (profileError) {
    if (profileError.code === "23505") {
      return { error: "That handle is already taken. Try another." };
    }
    return { error: profileError.message };
  }

  const { error: updateProfileError } = await supabase
    .from("profiles")
    .update({ country: identity.country })
    .eq("id", user.id);
  if (updateProfileError) return { error: updateProfileError.message };

  const platformRows = platforms.map((p) => ({
    creator_id: user.id,
    platform: p.platform,
    handle: p.handle,
    followers: p.followers,
    avg_engagement_rate: p.avg_engagement_rate,
    audience_health_score: p.audience_health_score,
    verified: p.verified,
  }));

  const { error: platformsError } = await supabase
    .from("creator_platforms")
    .insert(platformRows);
  if (platformsError) return { error: platformsError.message };

  const scoreError = await recomputeAndSaveScore(user.id);
  if (scoreError) return { error: scoreError };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
