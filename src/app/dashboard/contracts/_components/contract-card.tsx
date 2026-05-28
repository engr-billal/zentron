import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tables } from "@/types/database";
import type { UserRole } from "@/lib/permissions";
import { ContractStatusBadge } from "./contract-status-badge";

type Contract = Tables<"contracts">;

function formatMoney(cents: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  return `${symbol}${(cents / 100).toLocaleString("en-GB", {
    maximumFractionDigits: 0,
  })}`;
}

export function ContractCard({
  contract,
  counterpartyName,
  role,
}: {
  contract: Contract;
  counterpartyName: string;
  role: UserRole;
}) {
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

      <div className="mt-auto flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">Total fee</span>
        <span className="font-display text-lg text-ink tabular-nums">
          {formatMoney(contract.total_fee_cents, contract.currency)}
        </span>
      </div>
    </Link>
  );
}
