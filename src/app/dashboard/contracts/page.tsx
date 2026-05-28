import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { UserRole } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { ContractCard } from "./_components/contract-card";

export const metadata = { title: "Contracts" };

type Status = Database["public"]["Enums"]["contract_status"];

const FILTERS: Array<{ value: "all" | Status; label: string }> = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "pending_creator", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "declined", label: "Declined" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

export default async function ContractsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const role = (profile?.role ?? null) as UserRole | null;
  if (!role) redirect("/role-select");

  const params = await searchParams;
  const filter = (params.status ?? "all") as "all" | Status;

  let query = supabase
    .from("contracts")
    .select(
      "*, brand_profiles!inner(company_name), creator_profiles!inner(handle)",
    )
    .order("updated_at", { ascending: false });

  if (filter !== "all") query = query.eq("status", filter);

  const { data: contracts } = await query;
  const list = contracts ?? [];

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        Contracts
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
        {role === "brand" ? (
          <>
            Your <span className="italic text-brand">contracts.</span>
          </>
        ) : (
          <>
            Contracts <span className="italic text-brand">from brands.</span>
          </>
        )}
      </h1>

      <nav className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <Link
              key={f.value}
              href={
                f.value === "all"
                  ? "/dashboard/contracts"
                  : `/dashboard/contracts?status=${f.value}`
              }
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] transition-colors",
                active
                  ? "bg-ink text-paper"
                  : "border border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-ink",
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

      {list.length === 0 ? (
        <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-surface/40 p-10">
          <FileText className="size-6 text-brand" />
          <p className="font-display text-xl text-ink">No contracts to show.</p>
          <p className="max-w-md text-sm text-muted-foreground">
            {role === "brand"
              ? "Once a creator opts in to a brief, you can send them a contract from the brief detail page."
              : "Contracts will appear here when a brand sends you one."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => {
            const counterparty =
              role === "brand"
                ? (() => {
                    const cp = Array.isArray(c.creator_profiles)
                      ? c.creator_profiles[0]
                      : c.creator_profiles;
                    return cp?.handle ? `@${cp.handle}` : "Unknown";
                  })()
                : (() => {
                    const bp = Array.isArray(c.brand_profiles)
                      ? c.brand_profiles[0]
                      : c.brand_profiles;
                    return bp?.company_name ?? "Unknown";
                  })();
            return (
              <ContractCard
                key={c.id}
                contract={c}
                counterpartyName={counterparty}
                role={role}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
