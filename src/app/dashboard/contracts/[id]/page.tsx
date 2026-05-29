import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/permissions";
import { ContractStatusBadge } from "../_components/contract-status-badge";
import { MilestoneList } from "../_components/milestone-list";
import { ReviewForm } from "../_components/review-form";
import { ReviewList } from "../_components/review-list";
import { ContractDetail } from "./_components/contract-detail";
import { BrandContractActions } from "./_components/brand-contract-actions";
import { CreatorContractActions } from "./_components/creator-contract-actions";

export const metadata = { title: "Contract" };

function formatMoney(cents: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  return `${symbol}${(cents / 100).toLocaleString("en-GB", {
    maximumFractionDigits: 0,
  })}`;
}

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: contract } = await supabase
    .from("contracts")
    .select(
      "*, briefs!inner(id, title), brand_profiles!inner(company_name, industry), creator_profiles!inner(handle)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!contract) notFound();

  const isBrand = contract.brand_id === user.id;
  const isCreator = contract.creator_id === user.id;
  if (!isBrand && !isCreator) redirect("/dashboard");
  const role: UserRole = isBrand ? "brand" : "creator";

  const brand = Array.isArray(contract.brand_profiles)
    ? contract.brand_profiles[0]
    : contract.brand_profiles;
  const creator = Array.isArray(contract.creator_profiles)
    ? contract.creator_profiles[0]
    : contract.creator_profiles;
  const brief = Array.isArray(contract.briefs)
    ? contract.briefs[0]
    : contract.briefs;

  const { data: milestones } = await supabase
    .from("milestones")
    .select("*")
    .eq("contract_id", contract.id)
    .order("sequence", { ascending: true });

  const { data: reviews } = await supabase
    .from("contract_reviews")
    .select("*")
    .eq("contract_id", contract.id)
    .order("created_at", { ascending: true });

  const reviewList = reviews ?? [];
  const userHasReviewed = reviewList.some((r) => r.reviewer_id === user.id);
  const counterpartyName = isBrand
    ? `@${creator?.handle}`
    : brand?.company_name ?? "the brand";

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10">
      <Link
        href="/dashboard/contracts"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-ink"
      >
        <ArrowLeft className="size-3" />
        All contracts
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <ContractStatusBadge status={contract.status} />
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {isBrand ? "with creator" : "from brand"}:{" "}
              {isBrand ? `@${creator?.handle}` : brand?.company_name}
            </span>
          </div>
          <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
            {contract.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Based on brief{" "}
            <Link
              href={
                isBrand
                  ? `/dashboard/briefs/${brief?.id}`
                  : `/dashboard/invitations/${brief?.id}`
              }
              className="font-medium text-ink hover:text-brand"
            >
              {brief?.title}
            </Link>
            {" · "}
            <span className="font-medium text-ink tabular-nums">
              {formatMoney(contract.total_fee_cents, contract.currency)}
            </span>
          </p>
        </div>
        {isBrand ? (
          <BrandContractActions
            contractId={contract.id}
            status={contract.status}
          />
        ) : (
          <CreatorContractActions
            contractId={contract.id}
            status={contract.status}
          />
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <ContractDetail contract={contract} />
        <aside>
          <h2 className="mb-3 font-display text-xl text-ink">Milestones</h2>
          <MilestoneList
            milestones={milestones ?? []}
            currency={contract.currency}
            role={role}
            contractStatus={contract.status}
          />
        </aside>
      </div>

      {contract.status === "completed" ? (
        <div className="mt-12 flex flex-col gap-6">
          <h2 className="font-display text-2xl text-ink">Reviews</h2>
          {!userHasReviewed ? (
            <ReviewForm
              contractId={contract.id}
              counterpartyName={counterpartyName}
            />
          ) : null}
          <ReviewList
            reviews={reviewList}
            brandName={brand?.company_name ?? "Brand"}
            creatorHandle={creator?.handle ?? "creator"}
            brandId={contract.brand_id}
          />
        </div>
      ) : null}
    </section>
  );
}
