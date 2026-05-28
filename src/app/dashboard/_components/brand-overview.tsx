import Link from "next/link";
import { ArrowUpRight, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { BriefCard } from "@/app/dashboard/briefs/_components/brief-card";

const RECENT_BRIEFS_LIMIT = 6;

export async function BrandOverview({ userId }: { userId: string }) {
  const supabase = await createClient();

  const [{ data: brand }, { data: briefs }, { count: draftsCount }, { count: openCount }, { count: closedCount }, { count: invitationsSent }, { count: activeContracts }] =
    await Promise.all([
      supabase
        .from("brand_profiles")
        .select("company_name")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("briefs")
        .select("*")
        .eq("brand_id", userId)
        .order("updated_at", { ascending: false })
        .limit(RECENT_BRIEFS_LIMIT),
      supabase
        .from("briefs")
        .select("*", { count: "exact", head: true })
        .eq("brand_id", userId)
        .eq("status", "draft"),
      supabase
        .from("briefs")
        .select("*", { count: "exact", head: true })
        .eq("brand_id", userId)
        .eq("status", "open"),
      supabase
        .from("briefs")
        .select("*", { count: "exact", head: true })
        .eq("brand_id", userId)
        .eq("status", "closed"),
      supabase
        .from("brief_invitations")
        .select("brief_id, briefs!inner(brand_id)", {
          count: "exact",
          head: true,
        })
        .eq("briefs.brand_id", userId),
      supabase
        .from("contracts")
        .select("*", { count: "exact", head: true })
        .eq("brand_id", userId)
        .eq("status", "active"),
    ]);

  const hasBriefs = (briefs?.length ?? 0) > 0;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
            00 · Brand
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">
            Welcome,{" "}
            <span className="italic text-brand">
              {brand?.company_name ?? "Brand"}
            </span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Write a brief, get matched, invite the right creators.
          </p>
        </div>
        <Button asChild variant="brand" size="lg">
          <Link href="/dashboard/briefs/new">
            <Plus className="size-4" />
            Create brief
          </Link>
        </Button>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Drafts" value={draftsCount ?? 0} />
        <StatCard label="Open" value={openCount ?? 0} highlight />
        <StatCard label="Closed" value={closedCount ?? 0} />
        <StatCard label="Invitations sent" value={invitationsSent ?? 0} />
        <StatCard label="Active contracts" value={activeContracts ?? 0} />
      </dl>

      <div className="mt-12">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl text-ink">Recent briefs</h2>
          {hasBriefs ? (
            <Link
              href="/dashboard/briefs"
              className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-brand"
            >
              View all
              <ArrowUpRight className="size-3.5" />
            </Link>
          ) : null}
        </div>

        {hasBriefs ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {briefs!.map((b) => (
              <BriefCard key={b.id} brief={b} />
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-surface/40 p-10">
            <FileText className="size-6 text-brand" />
            <p className="font-display text-xl text-ink">
              No briefs yet.
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              Write your first brief and we&apos;ll show you the creators who
              match it.
            </p>
            <Button asChild variant="brand" size="sm">
              <Link href="/dashboard/briefs/new">
                <Plus className="size-3.5" />
                Create your first brief
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "relative overflow-hidden rounded-2xl bg-ink p-5 text-paper ring-1 ring-ink"
          : "relative overflow-hidden rounded-2xl border border-border bg-card p-5"
      }
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-brand"
      />
      <p
        className={
          highlight
            ? "text-[11px] uppercase tracking-[0.18em] text-paper/60"
            : "text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
        }
      >
        {label}
      </p>
      <p
        className={
          highlight
            ? "mt-2 font-display text-3xl text-brand tabular-nums"
            : "mt-2 font-display text-3xl text-ink tabular-nums"
        }
      >
        {value}
      </p>
    </div>
  );
}
