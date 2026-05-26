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

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user!.id)
    .maybeSingle();

  revalidatePath("/", "layout");
  redirect(data?.role ? "/dashboard" : "/role-select");
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

  if (parsed.data.role === "brand") {
    const { error } = await supabase.from("brand_profiles").insert({
      id: user.id,
      company_name:
        (user.user_metadata?.display_name as string | undefined) ??
        user.email?.split("@")[0] ??
        "New brand",
    });
    if (error && error.code !== "23505") return { error: error.message };
  } else {
    const fallbackHandle =
      user.email?.split("@")[0]?.replace(/[^a-z0-9_]/gi, "_").toLowerCase() ??
      `creator_${user.id.slice(0, 6)}`;
    const { error } = await supabase.from("creator_profiles").insert({
      id: user.id,
      handle: `${fallbackHandle}_${user.id.slice(0, 4)}`,
      primary_platform: "instagram",
    });
    if (error && error.code !== "23505") return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
