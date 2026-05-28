import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import { BriefCard } from "./_components/brief-card";
import { cn } from "@/lib/utils";

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
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const params = await searchParams;
  const filter = (params.status ?? "all") as "all" | Status;

  let query = supabase
    .from("briefs")
    .select("*")
    .eq("brand_id", user.id)
    .order("updated_at", { ascending: false });

  if (filter !== "all") query = query.eq("status", filter);

  const { data: briefs } = await query;
  const list = briefs ?? [];

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
            </Link>
          );
        })}
      </nav>

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
