"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CreatorInvitationActionState = { error: string } | null;

async function setStatus(
  briefId: string,
  status: "opted_in" | "declined" | "invited",
): Promise<CreatorInvitationActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase
    .from("brief_invitations")
    .update({
      status,
      responded_at: status === "invited" ? null : new Date().toISOString(),
    })
    .eq("brief_id", briefId)
    .eq("creator_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/invitations");
  revalidatePath(`/dashboard/invitations/${briefId}`);
  return null;
}

export async function optIn(briefId: string) {
  return setStatus(briefId, "opted_in");
}

export async function decline(briefId: string) {
  return setStatus(briefId, "declined");
}

export async function withdrawOptIn(briefId: string) {
  return setStatus(briefId, "invited");
}
