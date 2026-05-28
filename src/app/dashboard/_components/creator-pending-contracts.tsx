import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  CreatorContractCard,
  type CreatorContractSummary,
} from "./creator-contract-card";

export async function CreatorPendingContracts({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: contracts } = await supabase
    .from("contracts")
    .select(
      "id, title, total_fee_cents, currency, start_date, end_date, brand_profiles!inner(company_name)",
    )
    .eq("creator_id", userId)
    .eq("status", "pending_creator")
    .order("signed_brand_at", { ascending: false });

  if (!contracts || contracts.length === 0) return null;

  const contractIds = contracts.map((c) => c.id);
  const { data: milestoneCounts } = await supabase
    .from("milestones")
    .select("contract_id")
    .in("contract_id", contractIds);

  const milestoneCountByContract = new Map<string, number>();
  for (const row of milestoneCounts ?? []) {
    milestoneCountByContract.set(
      row.contract_id,
      (milestoneCountByContract.get(row.contract_id) ?? 0) + 1,
    );
  }

  const summaries: CreatorContractSummary[] = contracts.map((c) => {
    const brand = Array.isArray(c.brand_profiles)
      ? c.brand_profiles[0]
      : c.brand_profiles;
    return {
      contractId: c.id,
      title: c.title,
      brand: brand?.company_name ?? "A brand",
      totalFeeCents: c.total_fee_cents,
      currency: c.currency,
      milestoneCount: milestoneCountByContract.get(c.id) ?? 0,
      startDate: c.start_date,
      endDate: c.end_date,
    };
  });

  return (
    <section className="mb-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
            Contracts · {summaries.length} to sign
          </p>
          <h2 className="mt-2 font-display text-2xl text-ink">
            Contracts <span className="italic text-brand">to sign.</span>
          </h2>
        </div>
        <Link
          href="/dashboard/contracts"
          className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-brand"
        >
          View all
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {summaries.map((c) => (
          <CreatorContractCard key={c.contractId} contract={c} />
        ))}
      </div>
    </section>
  );
}
