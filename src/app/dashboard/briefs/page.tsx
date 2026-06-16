import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import { BriefCard } from "./_components/brief-card";
import { cn } from "@/lib/utils";
import { ListSearch } from "@/components/shared/list-search";

export const metadata = { title: "Briefs" };

type Status = Database["public"]["Enums"]["brief_status"];

const FILTERS: Array<{ value: "all" | Status; label: string }> = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
];

export default async function BriefsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const params = await searchParams;
  const filter = (params.status ?? "all") as "all" | Status;
  const queryText = (params.q ?? "").trim();

  const [{ data: briefs }, { count: allCount }, { count: draftCount }, { count: openCount }, { count: closedCount }] =
    await Promise.all([
      (() => {
        let query = supabase
          .from("briefs")
          .select("*")
          .eq("brand_id", user.id)
          .order("updated_at", { ascending: false });
        if (filter !== "all") query = query.eq("status", filter);
        if (queryText) query = query.ilike("title", `%${queryText}%`);
        return query;
      })(),
      supabase
        .from("briefs")
        .select("*", { count: "exact", head: true })
        .eq("brand_id", user.id),
      supabase
        .from("briefs")
        .select("*", { count: "exact", head: true })
        .eq("brand_id", user.id)
        .eq("status", "draft"),
      supabase
        .from("briefs")
        .select("*", { count: "exact", head: true })
        .eq("brand_id", user.id)
        .eq("status", "open"),
      supabase
        .from("briefs")
        .select("*", { count: "exact", head: true })
        .eq("brand_id", user.id)
        .eq("status", "closed"),
    ]);

  const list = briefs ?? [];
  const counts: Record<(typeof FILTERS)[number]["value"], number> = {
    all: allCount ?? 0,
    draft: draftCount ?? 0,
    open: openCount ?? 0,
    closed: closedCount ?? 0,
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
            Briefs
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
            Your <span className="italic text-brand">briefs.</span>
          </h1>
        </div>
        <Button asChild variant="brand" size="lg">
          <Link href="/dashboard/briefs/new">
            <Plus className="size-4" />
            New brief
          </Link>
        </Button>
      </div>

      <nav className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <Link
              key={f.value}
              href={f.value === "all" ? "/dashboard/briefs" : `/dashboard/briefs?status=${f.value}`}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] transition-colors",
                active
                  ? "bg-ink text-paper"
                  : "border border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-ink",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "ml-1.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                  active ? "bg-paper/20 text-paper" : "bg-surface text-muted-foreground",
                )}
              >
                {counts[f.value]}
              </span>
            </Link>
          );
        })}
      </nav>

      <ListSearch
        placeholder="Search briefs by title"
        defaultValue={queryText}
        preserveParams={{ status: filter === "all" ? undefined : filter }}
      />

      {list.length === 0 ? (
        <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-surface/40 p-10">
          <FileText className="size-6 text-brand" />
          <p className="font-display text-xl text-ink">No briefs to show.</p>
          <p className="max-w-md text-sm text-muted-foreground">
            {filter === "all"
              ? "Write your first brief — we'll show you matching creators the moment you publish."
              : "Switch the filter or create a new brief."}
          </p>
          <Button asChild variant="brand" size="sm">
            <Link href="/dashboard/briefs/new">Create a brief</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((b) => (
            <BriefCard key={b.id} brief={b} />
          ))}
        </div>
      )}
    </section>
  );
}
