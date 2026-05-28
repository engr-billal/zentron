import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NICHE_LABELS, PLATFORM_LABELS } from "@/lib/constants/creator";
import type { Niche } from "@/lib/scoring/types";

export type InvitationSummary = {
  briefId: string;
  title: string;
  brand: string;
  niche: string | null;
  platforms: string[];
  matchScore: number;
  invitedAt: string;
};

function timeSince(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days >= 1) return `${days}d ago`;
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours >= 1) return `${hours}h ago`;
  const mins = Math.floor(ms / (1000 * 60));
  return `${mins}m ago`;
}

export function CreatorInvitationCard({
  invitation,
}: {
  invitation: InvitationSummary;
}) {
  return (
    <Link
      href={`/dashboard/invitations/${invitation.briefId}`}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:ring-1 hover:ring-brand/40"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-brand" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
            {invitation.brand}
          </p>
          <h3 className="font-display text-lg leading-tight text-ink line-clamp-2">
            {invitation.title}
          </h3>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
      </div>

      <div className="flex flex-wrap gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {invitation.niche ? (
          <span className="rounded-full bg-surface px-2 py-0.5">
            {NICHE_LABELS[invitation.niche as Niche] ?? invitation.niche}
          </span>
        ) : null}
        {invitation.platforms.slice(0, 3).map((p) => (
          <span key={p} className="rounded-full bg-surface px-2 py-0.5">
            {PLATFORM_LABELS[p as keyof typeof PLATFORM_LABELS] ?? p}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-baseline justify-between">
        <span className="text-xs text-muted-foreground">
          Invited {timeSince(invitation.invitedAt)}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-xl text-brand tabular-nums">
            {invitation.matchScore}
          </span>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Match
          </span>
        </div>
      </div>
    </Link>
  );
}
