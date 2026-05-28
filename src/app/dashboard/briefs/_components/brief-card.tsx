import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tables } from "@/types/database";
import { NICHE_LABELS } from "@/lib/constants/creator";
import type { Niche } from "@/lib/scoring/types";
import { cn } from "@/lib/utils";
import { BriefStatusBadge } from "./brief-status-badge";

type Brief = Tables<"briefs">;

function formatMoney(cents: number | null, currency: string | null): string {
  if (cents === null) return "—";
  const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  return `${symbol}${(cents / 100).toLocaleString("en-GB", {
    maximumFractionDigits: 0,
  })}`;
}

export function BriefCard({ brief }: { brief: Brief }) {
  return (
    <Link
      href={`/dashboard/briefs/${brief.id}`}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:ring-1 hover:ring-brand/40",
      )}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-brand" />

      <div className="flex items-start justify-between gap-3">
        <BriefStatusBadge status={brief.status} />
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
      </div>

      <h3 className="font-display text-lg leading-tight text-ink line-clamp-2">
        {brief.title}
      </h3>

      <div className="flex flex-wrap gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {brief.niche ? (
          <span className="rounded-full bg-surface px-2 py-0.5">
            {NICHE_LABELS[brief.niche as Niche] ?? brief.niche}
          </span>
        ) : null}
        {brief.platforms.slice(0, 3).map((p) => (
          <span key={p} className="rounded-full bg-surface px-2 py-0.5">
            {p}
          </span>
        ))}
        {brief.platforms.length > 3 ? (
          <span className="rounded-full bg-surface px-2 py-0.5">
            +{brief.platforms.length - 3}
          </span>
        ) : null}
      </div>

      <div className="mt-auto flex items-baseline gap-2 text-sm">
        <span className="text-muted-foreground">Budget</span>
        <span className="font-medium tabular-nums text-ink">
          {formatMoney(brief.budget_min_cents, brief.currency)}
          {brief.budget_max_cents !== null
            ? ` – ${formatMoney(brief.budget_max_cents, brief.currency)}`
            : ""}
        </span>
      </div>
    </Link>
  );
}
