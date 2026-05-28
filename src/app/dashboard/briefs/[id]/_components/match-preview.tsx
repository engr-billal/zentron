import { createClient } from "@/lib/supabase/server";
import { shortlistForBrief } from "@/lib/matching/shortlist";
import type { Tables } from "@/types/database";
import { CandidateRow } from "./candidate-row";

type Brief = Tables<"briefs">;

const PREVIEW_LIMIT = 8;

export async function MatchPreview({ brief }: { brief: Brief }) {
  if (brief.status !== "open") {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-6 text-sm text-muted-foreground">
        Publish the brief to see matching creators.
      </div>
    );
  }

  const candidates = await shortlistForBrief(brief, PREVIEW_LIMIT);

  const supabase = await createClient();
  const { data: invitedRows } = await supabase
    .from("brief_invitations")
    .select("creator_id")
    .eq("brief_id", brief.id);
  const invitedIds = new Set(invitedRows?.map((r) => r.creator_id) ?? []);

  if (candidates.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-6 text-sm text-muted-foreground">
        No creators match this brief yet. Try broadening niche, platforms, or
        audience size.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Showing the top{" "}
        <span className="font-medium text-ink">{candidates.length}</span>{" "}
        creators ranked by match score for this brief.
      </p>
      <ul className="flex flex-col gap-3">
        {candidates.map((c) => (
          <CandidateRow
            key={c.creator.id}
            briefId={brief.id}
            candidate={c}
            alreadyInvited={invitedIds.has(c.creator.id)}
            canInvite={brief.status === "open"}
          />
        ))}
      </ul>
    </div>
  );
}
