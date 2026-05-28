import Link from "next/link";
import { ArrowUpRight, FileSignature } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ContractStatusBadge } from "@/app/dashboard/contracts/_components/contract-status-badge";

type Group = {
  label: string;
  status: "invited" | "opted_in" | "declined" | "expired";
};

const GROUPS: Group[] = [
  { label: "Pending", status: "invited" },
  { label: "Accepted", status: "opted_in" },
  { label: "Declined", status: "declined" },
];

export async function InvitationsSent({ briefId }: { briefId: string }) {
  const supabase = await createClient();

  const [{ data: invitations }, { data: contracts }] = await Promise.all([
    supabase
      .from("brief_invitations")
      .select(
        "creator_id, status, match_score, invited_at, responded_at, creator_profiles!inner(handle, primary_platform)",
      )
      .eq("brief_id", briefId)
      .order("invited_at", { ascending: false }),
    supabase
      .from("contracts")
      .select("id, creator_id, status")
      .eq("brief_id", briefId)
      .order("created_at", { ascending: false }),
  ]);

  const list = invitations ?? [];
  const contractByCreator = new Map<
    string,
    { id: string; status: "draft" | "pending_creator" | "active" | "declined" | "cancelled" | "completed" }
  >();
  for (const c of contracts ?? []) {
    if (!contractByCreator.has(c.creator_id)) {
      contractByCreator.set(c.creator_id, { id: c.id, status: c.status });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {GROUPS.map((g) => {
        const rows = list.filter((r) => r.status === g.status);
        return (
          <div key={g.status}>
            <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {g.label} ({rows.length})
            </p>
            {rows.length === 0 ? (
              <p className="rounded-lg bg-surface/40 px-3 py-2 text-xs text-muted-foreground">
                None yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {rows.map((r) => {
                  const creator = Array.isArray(r.creator_profiles)
                    ? r.creator_profiles[0]
                    : r.creator_profiles;
                  const contract =
                    g.status === "opted_in"
                      ? contractByCreator.get(r.creator_id)
                      : undefined;
                  return (
                    <li
                      key={r.creator_id}
                      className="flex items-center justify-between gap-2 rounded-lg bg-surface/40 px-3 py-2 text-sm"
                    >
                      <span className="text-ink">
                        @{creator?.handle ?? "unknown"}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-medium tabular-nums text-muted-foreground">
                          Match {r.match_score}
                        </span>
                        {g.status === "opted_in" ? (
                          contract ? (
                            <Link
                              href={`/dashboard/contracts/${contract.id}`}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink hover:text-brand"
                            >
                              <ContractStatusBadge status={contract.status} />
                              <ArrowUpRight className="size-3" />
                            </Link>
                          ) : (
                            <Link
                              href={`/dashboard/contracts/new?brief=${briefId}&creator=${r.creator_id}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                            >
                              <FileSignature className="size-3" />
                              Send contract
                            </Link>
                          )
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
