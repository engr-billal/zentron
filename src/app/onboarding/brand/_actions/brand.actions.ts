"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  completeBrandOnboardingSchema,
  type CompleteBrandOnboardingInput,
} from "@/lib/validations/brand";

export type BrandActionState = { error: string } | null;

export async function completeBrandOnboarding(
  input: CompleteBrandOnboardingInput,
): Promise<BrandActionState> {
  const parsed = completeBrandOnboardingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { company, targeting, billing } = parsed.data;

  const { error: insertError } = await supabase.from("brand_profiles").insert({
    id: user.id,
    company_name: company.company_name,
    website: company.website || null,
    industry: company.industry,
    team_size: company.team_size,
    billing_country: billing.billing_country,
    default_niches: targeting.default_niches,
    default_platforms: targeting.default_platforms,
    default_audience_bands: targeting.default_audience_bands,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      // brand_profiles row already exists; treat as success
      revalidatePath("/", "layout");
      redirect("/dashboard");
    }
    return { error: insertError.message };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ country: billing.billing_country })
    .eq("id", user.id);
  if (profileError) return { error: profileError.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
