import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tables } from "@/types/database";
import type { UserRole } from "@/lib/permissions";
import { ContractStatusBadge } from "./contract-status-badge";

type Contract = Tables<"contracts">;
type Milestone = Pick<
  Tables<"milestones">,
  "id" | "status" | "amount_cents" | "sequence"
>;

function formatMoney(cents: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  return `${symbol}${(cents / 100).toLocaleString("en-GB", {
    maximumFractionDigits: 0,
  })}`;
}

function progressLabel(milestones: Milestone[]): string {
  if (milestones.length === 0) return "No milestones";
  const released = milestones.filter((m) => m.status === "released").length;
  return `${released}/${milestones.length} released`;
}

function progressPct(milestones: Milestone[]): number {
  if (milestones.length === 0) return 0;
  const released = milestones.filter((m) => m.status === "released").length;
  return Math.round((released / milestones.length) * 100);
}

export function CampaignCard({
  contract,
  milestones,
  counterpartyName,
  role,
}: {
  contract: Contract;
  milestones: Milestone[];
  counterpartyName: string;
  role: UserRole;
}) {
  const pct = progressPct(milestones);

  return (
    <Link
      href={`/dashboard/contracts/${contract.id}`}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:ring-1 hover:ring-brand/40"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-brand" />

      <div className="flex items-start justify-between gap-3">
        <ContractStatusBadge status={contract.status} />
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
      </div>

      <h3 className="font-display text-lg leading-tight text-ink line-clamp-2">
        {contract.title}
      </h3>

      <p className="text-xs text-muted-foreground">
        {role === "brand" ? "Creator" : "Brand"}: {counterpartyName}
      </p>

      <div className="mt-1 flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>Milestones</span>
          <span className="text-ink/80">{progressLabel(milestones)}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full bg-brand transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-auto flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">Total fee</span>
        <span className="font-display text-lg text-ink tabular-nums">
          {formatMoney(contract.total_fee_cents, contract.currency)}
        </span>
      </div>
    </Link>
  );
}
