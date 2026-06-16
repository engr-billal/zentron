"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
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
    accepted_terms: formData.get("accepted_terms"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const intendedRole = formData.get("intended_role");
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${siteUrl()}/api/auth/callback`,
      data:
        intendedRole === "brand" || intendedRole === "creator"
          ? { intended_role: intendedRole }
          : undefined,
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

export async function signInWithGoogle(): Promise<ActionState> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl()}/api/auth/callback`,
    },
  });
  if (error) return { error: error.message };
  if (!data.url) return { error: "Could not start Google sign-in." };

  redirect(data.url);
}

export type ForgotPasswordState =
  | { error: string }
  | { success: true }
  | null;

export async function requestPasswordReset(
  _prev: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${siteUrl()}/api/auth/callback?next=/reset-password`,
    },
  );

  if (error) return { error: error.message };

  return { success: true };
}

export async function resetPassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid password" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Reset link expired. Request a new one." };

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
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

  // brand_profiles and creator_profiles rows are inserted by the respective
  // onboarding wizards, not here.
  revalidatePath("/", "layout");
  redirect(
    parsed.data.role === "brand" ? "/onboarding/brand" : "/onboarding/creator",
  );
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
  if (profile.role === "brand") {
    const { data } = await supabase
      .from("brand_profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    return data ? "/dashboard" : "/onboarding/brand";
  }
  return "/dashboard";
}
