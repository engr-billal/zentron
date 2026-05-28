import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  CreatorInvitationCard,
  type InvitationSummary,
} from "./creator-invitation-card";

const PREVIEW_LIMIT = 4;

export async function CreatorInvitations({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("brief_invitations")
    .select(
      "brief_id, status, match_score, invited_at, briefs!inner(id, title, niche, platforms, brand_id, brand_profiles!inner(company_name))",
    )
    .eq("creator_id", userId)
    .eq("status", "invited")
    .order("invited_at", { ascending: false })
    .limit(PREVIEW_LIMIT);

  if (!data || data.length === 0) return null;

  const invitations: InvitationSummary[] = data.map((r) => {
    const brief = Array.isArray(r.briefs) ? r.briefs[0] : r.briefs;
    const brand = Array.isArray(brief?.brand_profiles)
      ? brief?.brand_profiles[0]
      : brief?.brand_profiles;
    return {
      briefId: r.brief_id,
      title: brief?.title ?? "Untitled brief",
      brand: brand?.company_name ?? "A brand",
      niche: brief?.niche ?? null,
      platforms: brief?.platforms ?? [],
      matchScore: r.match_score,
      invitedAt: r.invited_at,
    };
  });

  return (
    <section className="mb-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
            Invitations · {invitations.length} pending
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink">
            Briefs <span className="italic text-brand">waiting for you.</span>
          </h2>
        </div>
        <Link
          href="/dashboard/invitations"
          className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-brand"
        >
          View all
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {invitations.map((inv) => (
          <CreatorInvitationCard key={inv.briefId} invitation={inv} />
        ))}
      </div>
    </section>
  );
}
