import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BriefStatusBadge } from "../_components/brief-status-badge";
import { BriefDetail } from "./_components/brief-detail";
import { BriefActions } from "./_components/brief-actions";
import { MatchPreview } from "./_components/match-preview";
import { InvitationsSent } from "./_components/invitations-sent";
import { BriefShareLink } from "./_components/brief-share-link";

export const metadata = { title: "Brief detail" };

export default async function BriefDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: brief } = await supabase
    .from("briefs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!brief) notFound();
  if (brief.brand_id !== user.id) {
    // Brand-only route. Creators should view via /dashboard/invitations/[brief_id].
    redirect("/dashboard");
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10">
      <Link
        href="/dashboard/briefs"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-ink"
      >
        <ArrowLeft className="size-3" />
        All briefs
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <BriefStatusBadge status={brief.status} />
          <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
            {brief.title}
          </h1>
        </div>
        <BriefActions briefId={brief.id} status={brief.status} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <BriefDetail brief={brief} />
        </div>

        <aside className="flex flex-col gap-8">
          {brief.status !== "closed" ? (
            <BriefShareLink briefId={brief.id} />
          ) : null}
          <section>
            <h2 className="mb-3 font-display text-xl text-ink">
              Invitations sent
            </h2>
            <InvitationsSent briefId={brief.id} />
          </section>
        </aside>
      </div>

      <div className="mt-14">
        <h2 className="mb-4 font-display text-2xl text-ink">
          Matching creators
        </h2>
        <MatchPreview brief={brief} />
      </div>
    </section>
  );
}
