import Link from "next/link";
import { redirect } from "next/navigation";
import { Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { CampaignCard } from "../contracts/_components/campaign-card";
import { ListSearch } from "@/components/shared/list-search";

export const metadata = { title: "Campaigns" };

type Filter = "active" | "completed" | "all";

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "all", label: "All" },
];

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
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
  const filter: Filter =
    params.status === "completed" || params.status === "all"
      ? params.status
      : "active";
  const queryText = (params.q ?? "").trim();

  let query = supabase
    .from("contracts")
    .select(
      "*, brand_profiles!inner(company_name), creator_profiles!inner(handle), milestones(id, status, amount_cents, sequence)",
    )
    .order("updated_at", { ascending: false });

  if (filter === "active") query = query.eq("status", "active");
  else if (filter === "completed") query = query.eq("status", "completed");
  else query = query.in("status", ["active", "completed"]);
  if (queryText) query = query.ilike("title", `%${queryText}%`);

  const { data: contracts } = await query;
  const list = contracts ?? [];

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        Campaigns
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
        {role === "brand" ? (
          <>
            Live <span className="italic text-brand">collabs.</span>
          </>
        ) : (
          <>
            Your <span className="italic text-brand">collabs.</span>
          </>
        )}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Signed contracts that are running or already wrapped. Track milestone
        progress here, jump into a campaign to submit deliverables or review
        them.
      </p>

      <nav className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <Link
              key={f.value}
              href={
                f.value === "active"
                  ? "/dashboard/campaigns"
                  : `/dashboard/campaigns?status=${f.value}`
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

      <ListSearch
        placeholder="Search campaigns by title"
        defaultValue={queryText}
        preserveParams={{
          status: filter === "active" ? undefined : filter,
        }}
      />

      {list.length === 0 ? (
        <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-surface/40 p-10">
          <Megaphone className="size-6 text-brand" />
          <p className="font-display text-xl text-ink">
            No campaigns to show yet.
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            {role === "brand"
              ? "Once a creator signs a contract, it lands here and you can track milestone delivery from this page."
              : "Sign a contract from a brand to start a campaign — it'll show up here with milestone progress."}
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
              <CampaignCard
                key={c.id}
                contract={c}
                milestones={c.milestones ?? []}
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
