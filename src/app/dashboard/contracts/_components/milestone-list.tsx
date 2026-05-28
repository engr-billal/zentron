import type { Tables } from "@/types/database";

type Milestone = Tables<"milestones">;

function formatMoney(cents: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  return `${symbol}${(cents / 100).toLocaleString("en-GB", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function MilestoneList({
  milestones,
  currency,
}: {
  milestones: Milestone[];
  currency: string;
}) {
  if (milestones.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No milestones defined.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {milestones.map((m) => (
        <li
          key={m.id}
          className="relative overflow-hidden rounded-xl border border-border bg-card p-4"
        >
          <span aria-hidden className="absolute inset-x-4 top-0 h-px bg-brand" />
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <p className="flex items-center gap-2 font-medium text-ink">
                <span className="text-[11px] uppercase tracking-[0.14em] text-brand">
                  M{String(m.sequence).padStart(2, "0")}
                </span>
                {m.title}
              </p>
              {m.description ? (
                <p className="text-xs text-muted-foreground">{m.description}</p>
              ) : null}
            </div>
            <div className="text-right">
              <p className="font-display text-lg leading-none text-ink tabular-nums">
                {formatMoney(m.amount_cents, currency)}
              </p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Due {formatDate(m.due_at)}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
