import type { Database } from "@/types/database";
import { cn } from "@/lib/utils";

type Status = Database["public"]["Enums"]["milestone_status"];

const STYLES: Record<Status, string> = {
  pending: "bg-surface text-muted-foreground ring-border",
  submitted: "bg-brand/10 text-brand ring-brand/30",
  approved: "bg-ink/10 text-ink/80 ring-ink/15",
  rejected: "bg-destructive/10 text-destructive ring-destructive/30",
  released: "bg-brand text-brand-foreground ring-brand",
};

const LABELS: Record<Status, string> = {
  pending: "Pending",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Changes requested",
  released: "Released",
};

export function MilestoneStatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ring-1",
        STYLES[status],
      )}
    >
      {LABELS[status]}
    </span>
  );
}

export const MILESTONE_STATUS_LABELS = LABELS;
