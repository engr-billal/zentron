"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type WaitlistActionState =
  | { error: string }
  | { success: true; email: string }
  | null;

const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  role_intent: z.enum(["brand", "creator", "either"]).default("either"),
  source: z.string().trim().max(100).optional(),
});

export async function joinWaitlist(
  _prev: WaitlistActionState,
  formData: FormData,
): Promise<WaitlistActionState> {
  const parsed = waitlistSchema.safeParse({
    email: formData.get("email"),
    role_intent: formData.get("role_intent") || "either",
    source: formData.get("source") || undefined,
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Enter a valid email",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist").insert({
    email: parsed.data.email,
    role_intent: parsed.data.role_intent,
    source: parsed.data.source ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: true, email: parsed.data.email };
    }
    return { error: error.message };
  }

  return { success: true, email: parsed.data.email };
}
