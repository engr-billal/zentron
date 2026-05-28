import { cn } from "@/lib/utils";

export function StepIndicator({
  step,
  total,
  labels,
}: {
  step: number;
  total: number;
  labels: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em]">
      {Array.from({ length: total }).map((_, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <div key={i} className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex size-6 items-center justify-center rounded-full text-[10px] tabular-nums transition-colors",
                done && "bg-brand text-brand-foreground",
                active && "bg-ink text-paper",
                !active && !done && "bg-surface text-muted-foreground",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={cn(
                "transition-colors",
                active ? "text-ink" : "text-muted-foreground",
              )}
            >
              {labels[i]}
            </span>
            {i < total - 1 ? (
              <span aria-hidden className="h-px w-6 bg-border" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
