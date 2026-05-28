import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import {
  CreatorInvitationCard,
  type InvitationSummary,
} from "../_components/creator-invitation-card";
import type { Database } from "@/types/database";

export const metadata = { title: "Invitations" };

type Status = Database["public"]["Enums"]["invitation_status"];

const FILTERS: Array<{ value: "all" | Status; label: string }> = [
  { value: "invited", label: "Pending" },
  { value: "opted_in", label: "Accepted" },
  { value: "declined", label: "Declined" },
  { value: "all", label: "All" },
];

export default async function InvitationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const params = await searchParams;
  const filter = (params.status ?? "invited") as "all" | Status;

  let query = supabase
    .from("brief_invitations")
    .select(
      "brief_id, status, match_score, invited_at, briefs!inner(id, title, niche, platforms, brand_id, brand_profiles!inner(company_name))",
    )
    .eq("creator_id", user.id)
    .order("invited_at", { ascending: false });

  if (filter !== "all") query = query.eq("status", filter);

  const { data } = await query;
  const rows = data ?? [];

  const invitations: InvitationSummary[] = rows.map((r) => {
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
    <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        Invitations
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
        Brands inviting <span className="italic text-brand">you.</span>
      </h1>

      <nav className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <Link
              key={f.value}
              href={
                f.value === "invited"
                  ? "/dashboard/invitations"
                  : `/dashboard/invitations?status=${f.value}`
              }
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] transition-colors",
                active
                  ? "bg-ink text-paper"
                  : "border border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-ink",
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

      {invitations.length === 0 ? (
        <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-surface/40 p-10">
          <Inbox className="size-6 text-brand" />
          <p className="font-display text-xl text-ink">
            No invitations here.
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            Keep your platforms current and your Zentron Score sharp — brands
            invite the highest-fit creators first.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {invitations.map((inv) => (
            <CreatorInvitationCard key={inv.briefId} invitation={inv} />
          ))}
        </div>
      )}
    </section>
  );
}
