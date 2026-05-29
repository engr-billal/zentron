"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type SettingsActionState = { error: string } | { success: true } | null;

const displayNameSchema = z
  .string()
  .trim()
  .min(1, "Display name is required")
  .max(100, "Display name is too long");

const accountSettingsSchema = z.object({
  display_name: displayNameSchema,
  country: z
    .string()
    .trim()
    .length(2, "Use a 2-letter country code")
    .toUpperCase(),
});

const brandInvoicingSchema = z.object({
  billing_country: z
    .string()
    .trim()
    .length(2, "Use a 2-letter country code")
    .toUpperCase(),
});

export async function updateAccountSettings(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = accountSettingsSchema.safeParse({
    display_name: formData.get("display_name"),
    country: formData.get("country"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.display_name,
      country: parsed.data.country,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateBrandInvoicing(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = brandInvoicingSchema.safeParse({
    billing_country: formData.get("billing_country"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "brand") {
    return { error: "Only brand accounts can update invoicing." };
  }

  const { error } = await supabase
    .from("brand_profiles")
    .update({ billing_country: parsed.data.billing_country })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings");
  return { success: true };
}
