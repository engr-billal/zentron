"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLATFORM_LABELS } from "@/lib/constants/creator";
import { AUDIENCE_BAND_LABELS } from "@/lib/constants/brand";
import { cn } from "@/lib/utils";
import type { MatchCandidate } from "@/lib/matching/types";
import { sendInvitation } from "../_actions/invitation.actions";

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function CandidateRow({
  briefId,
  candidate,
  alreadyInvited,
  canInvite,
}: {
  briefId: string;
  candidate: MatchCandidate;
  alreadyInvited: boolean;
  canInvite: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const handleInvite = () => {
    startTransition(async () => {
      await sendInvitation(briefId, candidate.creator.id, candidate.matchScore);
    });
  };

  return (
    <li className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-brand" />
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-ink">
              @{candidate.creator.handle}
            </span>
            {candidate.displayName ? (
              <span className="text-sm text-muted-foreground">
                {candidate.displayName}
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="rounded-full bg-surface px-2 py-0.5">
              {PLATFORM_LABELS[candidate.creator.primary_platform]}
            </span>
            {candidate.score?.audience_size_band ? (
              <span className="rounded-full bg-surface px-2 py-0.5">
                {AUDIENCE_BAND_LABELS[candidate.score.audience_size_band]}
              </span>
            ) : null}
            {candidate.primaryPlatform ? (
              <span className="rounded-full bg-surface px-2 py-0.5">
                {formatFollowers(candidate.primaryPlatform.followers)} followers
              </span>
            ) : null}
          </div>
          {candidate.matchReasons.length > 0 ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {candidate.matchReasons.join(" · ")}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-display text-2xl leading-none text-brand tabular-nums">
              {candidate.matchScore}
            </p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Match
            </p>
          </div>
          {alreadyInvited ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled
              className={cn("gap-1.5")}
            >
              <Check className="size-3.5" />
              Invited
            </Button>
          ) : (
            <Button
              type="button"
              variant="brand"
              size="sm"
              onClick={handleInvite}
              disabled={!canInvite || pending}
            >
              {pending ? "Inviting..." : "Invite"}
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
