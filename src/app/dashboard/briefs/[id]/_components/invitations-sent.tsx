import { createClient } from "@/lib/supabase/server";

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

  const { data: invitations } = await supabase
    .from("brief_invitations")
    .select(
      "creator_id, status, match_score, invited_at, responded_at, creator_profiles!inner(handle, primary_platform)",
    )
    .eq("brief_id", briefId)
    .order("invited_at", { ascending: false });

  const list = invitations ?? [];

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
                  return (
                    <li
                      key={r.creator_id}
                      className="flex items-center justify-between rounded-lg bg-surface/40 px-3 py-2 text-sm"
                    >
                      <span className="text-ink">
                        @{creator?.handle ?? "unknown"}
                      </span>
                      <span className="font-medium tabular-nums text-muted-foreground">
                        Match {r.match_score}
                      </span>
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
