"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type ContactActionState = { error: string } | { success: true } | null;

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().email(),
  message: z.string().trim().min(10).max(2000),
});

export async function submitContactMessage(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) return { error: error.message };
  return { success: true };
}
