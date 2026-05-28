import type { Database } from "@/types/database";
import { cn } from "@/lib/utils";

type Status = Database["public"]["Enums"]["brief_status"];

const STYLES: Record<Status, string> = {
  draft: "bg-surface text-muted-foreground ring-border",
  open: "bg-brand/10 text-brand ring-brand/30",
  closed: "bg-ink/10 text-ink/70 ring-ink/15",
};

const LABELS: Record<Status, string> = {
  draft: "Draft",
  open: "Open",
  closed: "Closed",
};

export function BriefStatusBadge({ status }: { status: Status }) {
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
