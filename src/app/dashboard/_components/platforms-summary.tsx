import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Plus } from "lucide-react";
import type { Tables } from "@/types/database";
import { PLATFORM_LABELS } from "@/lib/constants/creator";

type Platform = Tables<"creator_platforms">;

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function PlatformsSummary({
  platforms,
  primary,
}: {
  platforms: Platform[];
  primary: Platform["platform"];
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-brand" />

      <div className="flex items-center justify-between border-b border-border bg-surface/60 px-6 py-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Your platforms
        </p>
        <Link
          href="/dashboard/platforms"
          className="inline-flex items-center gap-1 text-xs font-medium text-ink hover:text-brand"
        >
          Manage
          <ArrowUpRight className="size-3" />
        </Link>
      </div>

      {platforms.length === 0 ? (
        <div className="flex flex-col items-start gap-2 px-6 py-6">
          <p className="text-sm text-muted-foreground">
            No platforms yet. Add one to compute your score.
          </p>
          <Link
            href="/dashboard/platforms"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand"
          >
            <Plus className="size-3.5" />
            Add a platform
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {platforms.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="flex flex-col gap-0.5">
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  {PLATFORM_LABELS[p.platform]}
                  {p.platform === primary ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-brand">
                      Primary
                    </span>
                  ) : null}
                  {p.verified ? (
                    <CheckCircle2 className="size-3.5 text-brand" />
                  ) : null}
                </span>
                <span className="text-xs text-muted-foreground">
                  {p.handle}
                </span>
              </div>
              <div className="text-right">
                <p className="font-display text-base text-ink tabular-nums">
                  {formatFollowers(p.followers)}
                </p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {(Number(p.avg_engagement_rate) * 100).toFixed(1)}% engagement
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
