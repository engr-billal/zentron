"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type InvitationActionState = { error: string } | null;

export async function sendInvitation(
  briefId: string,
  creatorId: string,
  matchScoreSnapshot: number,
): Promise<InvitationActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: brief } = await supabase
    .from("briefs")
    .select("id, brand_id, status")
    .eq("id", briefId)
    .maybeSingle();

  if (!brief || brief.brand_id !== user.id) {
    return { error: "Brief not found or not yours." };
  }
  if (brief.status !== "open") {
    return { error: "Only open briefs can send invitations." };
  }

  const { error } = await supabase.from("brief_invitations").insert({
    brief_id: briefId,
    creator_id: creatorId,
    match_score: Math.max(0, Math.min(100, Math.round(matchScoreSnapshot))),
    status: "invited",
  });

  if (error) {
    if (error.code === "23505") {
      // Already invited — treat as success
      revalidatePath(`/dashboard/briefs/${briefId}`);
      return null;
    }
    return { error: error.message };
  }

  revalidatePath(`/dashboard/briefs/${briefId}`);
  revalidatePath("/dashboard");
  return null;
}

export async function withdrawInvitation(
  briefId: string,
  creatorId: string,
): Promise<InvitationActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: brief } = await supabase
    .from("briefs")
    .select("id, brand_id")
    .eq("id", briefId)
    .maybeSingle();

  if (!brief || brief.brand_id !== user.id) {
    return { error: "Brief not found or not yours." };
  }

  const { error } = await supabase
    .from("brief_invitations")
    .delete()
    .eq("brief_id", briefId)
    .eq("creator_id", creatorId)
    .eq("status", "invited");

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/briefs/${briefId}`);
  return null;
}
