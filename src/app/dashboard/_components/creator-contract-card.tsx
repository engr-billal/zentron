import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type CreatorContractSummary = {
  contractId: string;
  title: string;
  brand: string;
  totalFeeCents: number;
  currency: string;
  milestoneCount: number;
  startDate: string | null;
  endDate: string | null;
};

function formatMoney(cents: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  return `${symbol}${(cents / 100).toLocaleString("en-GB", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDateShort(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
  });
}

export function CreatorContractCard({
  contract,
}: {
  contract: CreatorContractSummary;
}) {
  return (
    <Link
      href={`/dashboard/contracts/${contract.contractId}`}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:ring-1 hover:ring-brand/40"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-brand" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
            {contract.brand}
          </p>
          <h3 className="font-display text-lg leading-tight text-ink line-clamp-2">
            {contract.title}
          </h3>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em]">Total fee</p>
          <p className="mt-0.5 font-display text-lg text-ink tabular-nums">
            {formatMoney(contract.totalFeeCents, contract.currency)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em]">Milestones</p>
          <p className="mt-0.5 font-display text-lg text-ink tabular-nums">
            {contract.milestoneCount}
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {contract.startDate || contract.endDate
          ? `${formatDateShort(contract.startDate)} – ${formatDateShort(contract.endDate)}`
          : "No dates set"}
      </p>
    </Link>
  );
}
