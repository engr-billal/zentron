import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BriefReadOnly } from "./_components/brief-read-only";
import { InvitationActions } from "./_components/invitation-actions";

export const metadata = { title: "Invitation" };

export default async function CreatorInvitationDetailPage({
  params,
}: {
  params: Promise<{ brief_id: string }>;
}) {
  const { brief_id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: invitation } = await supabase
    .from("brief_invitations")
    .select("brief_id, status, match_score, invited_at, responded_at")
    .eq("brief_id", brief_id)
    .eq("creator_id", user.id)
    .maybeSingle();

  if (!invitation) notFound();

  const { data: brief } = await supabase
    .from("briefs")
    .select("*, brand_profiles!inner(company_name, industry)")
    .eq("id", brief_id)
    .maybeSingle();

  if (!brief) notFound();

  const brand = Array.isArray(brief.brand_profiles)
    ? brief.brand_profiles[0]
    : brief.brand_profiles;

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-10">
      <Link
        href="/dashboard/invitations"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-ink"
      >
        <ArrowLeft className="size-3" />
        All invitations
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
            {brand?.company_name ?? "A brand"}
            {brand?.industry ? ` · ${brand.industry}` : ""}
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
            {brief.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Match score:{" "}
            <span className="font-display text-brand">
              {invitation.match_score}
            </span>
          </p>
        </div>
        <InvitationActions briefId={brief.id} status={invitation.status} />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <BriefReadOnly brief={brief} />
      </div>
    </section>
  );
}
