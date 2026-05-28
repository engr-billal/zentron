import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ScoreCard } from "./score-card";
import { PlatformsSummary } from "./platforms-summary";
import { ProfileSummary } from "./profile-summary";
import { CreatorInvitations } from "./creator-invitations";
import { CreatorPendingContracts } from "./creator-pending-contracts";

export async function CreatorOverview({ userId }: { userId: string }) {
  const supabase = await createClient();

  const [{ data: profile }, { data: creator }, { data: platforms }, { data: score }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, country")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("creator_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("creator_platforms")
        .select("*")
        .eq("creator_id", userId)
        .order("created_at", { ascending: true }),
      supabase
        .from("creator_scores")
        .select("*")
        .eq("creator_id", userId)
        .maybeSingle(),
    ]);

  if (!creator || !profile) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
            00 · Creator
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">
            Welcome,{" "}
            <span className="italic text-brand">
              {profile.display_name ?? creator.handle}
            </span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your Zentron Score is what brands see first. Keep your platforms
            current to keep your score accurate.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/platforms">
            <ArrowUpRight className="size-3.5" />
            Manage platforms
          </Link>
        </Button>
      </div>

      <div className="mt-10">
        <CreatorPendingContracts userId={userId} />
        <CreatorInvitations userId={userId} />
      </div>

      <div className="flex flex-col gap-6">
        {score ? (
          <ScoreCard score={score} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-8 text-center">
            <p className="font-display text-xl text-ink">
              Score not computed yet.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a platform that matches your primary platform to generate
              your Zentron Score.
            </p>
            <Button asChild variant="brand" size="sm" className="mt-4">
              <Link href="/dashboard/platforms">Add a platform</Link>
            </Button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <PlatformsSummary
            platforms={platforms ?? []}
            primary={creator.primary_platform}
          />
          <ProfileSummary creator={creator} profile={profile} />
        </div>
      </div>
    </section>
  );
}
