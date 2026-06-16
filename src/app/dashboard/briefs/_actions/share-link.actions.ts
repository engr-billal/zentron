"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ShareLinkState =
  | { error: string }
  | { success: true; url: string; expiresAt: string }
  | null;

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function createBriefShareLink(
  briefId: string,
): Promise<ShareLinkState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: brief } = await supabase
    .from("briefs")
    .select("id, status")
    .eq("id", briefId)
    .eq("brand_id", user.id)
    .maybeSingle();

  if (!brief) return { error: "Brief not found." };
  if (brief.status === "closed") {
    return { error: "Closed briefs cannot accept new invite links." };
  }

  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("brief_share_links").insert({
    brief_id: briefId,
    created_by: user.id,
    token,
    expires_at: expiresAt,
  });

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/briefs/${briefId}`);
  return {
    success: true,
    url: `${siteUrl()}/invite/${token}`,
    expiresAt,
  };
}

export async function redeemBriefShareLink(
  token: string,
): Promise<{ error: string } | { briefId: string }> {
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
  if (profile?.role !== "creator") {
    return { error: "Only creator accounts can redeem invite links." };
  }

  const { data, error } = await supabase.rpc("redeem_brief_share_link", {
    p_token: token,
  });

  if (error) return { error: error.message };
  const briefId = data as string;
  return { briefId };
}
