import type { Database } from "@/types/database";
import { cn } from "@/lib/utils";

type Status = Database["public"]["Enums"]["contract_status"];

const STYLES: Record<Status, string> = {
  draft: "bg-surface text-muted-foreground ring-border",
  pending_creator: "bg-brand/10 text-brand ring-brand/30",
  active: "bg-brand text-brand-foreground ring-brand",
  declined: "bg-destructive/10 text-destructive ring-destructive/30",
  cancelled: "bg-ink/10 text-ink/70 ring-ink/15",
  completed: "bg-ink text-paper ring-ink",
};

const LABELS: Record<Status, string> = {
  draft: "Draft",
  pending_creator: "Pending creator",
  active: "Active",
  declined: "Declined",
  cancelled: "Cancelled",
  completed: "Completed",
};

export function ContractStatusBadge({ status }: { status: Status }) {
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

export const CONTRACT_STATUS_LABELS = LABELS;
