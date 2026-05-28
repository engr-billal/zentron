"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  roleSelectSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validations/auth";

export type ActionState = { error: string } | null;

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signUp(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${siteUrl()}/api/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  redirect("/verify-email");
}

export async function signIn(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };

  const userId = (await supabase.auth.getUser()).data.user!.id;
  const next = await nextStepAfterAuth(userId);

  revalidatePath("/", "layout");
  redirect(next);
}

export async function selectRole(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = roleSelectSchema.safeParse({ role: formData.get("role") });
  if (!parsed.success) {
    return { error: "Pick brand or creator." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: parsed.data.role })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  // Brand still gets a stub profile until the brand onboarding wizard lands in
  // the next slice. Creator goes straight to /onboarding/creator.
  if (parsed.data.role === "brand") {
    const { error } = await supabase.from("brand_profiles").insert({
      id: user.id,
      company_name:
        (user.user_metadata?.display_name as string | undefined) ??
        user.email?.split("@")[0] ??
        "New brand",
    });
    if (error && error.code !== "23505") return { error: error.message };
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  revalidatePath("/", "layout");
  redirect("/onboarding/creator");
}

async function nextStepAfterAuth(userId: string): Promise<string> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (!profile?.role) return "/role-select";

  if (profile.role === "creator") {
    const { data } = await supabase
      .from("creator_profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    return data ? "/dashboard" : "/onboarding/creator";
  }
  return "/dashboard";
}
