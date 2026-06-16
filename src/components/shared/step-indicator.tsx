import { cn } from "@/lib/utils";

export function StepIndicator({
  step,
  total,
  labels,
  onStepClick,
}: {
  step: number;
  total: number;
  labels: string[];
  onStepClick?: (index: number) => void;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em]"
      aria-label="Progress"
    >
      {Array.from({ length: total }).map((_, i) => {
        const active = i === step;
        const done = i < step;
        const clickable = done && onStepClick;
        const StepTag = clickable ? "button" : "div";

        return (
          <div key={i} className="flex items-center gap-3">
            <StepTag
              type={clickable ? "button" : undefined}
              onClick={clickable ? () => onStepClick(i) : undefined}
              disabled={!clickable}
              className={cn(
                "flex items-center gap-3 border-0 bg-transparent p-0 text-left",
                clickable && "cursor-pointer rounded-md hover:opacity-80",
                !clickable && !active && !done && "cursor-default",
              )}
              aria-current={active ? "step" : undefined}
              aria-label={
                clickable
                  ? `Go back to step ${i + 1}: ${labels[i]}`
                  : active
                    ? `Current step ${i + 1}: ${labels[i]}`
                    : `Step ${i + 1}: ${labels[i]}`
              }
            >
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
                  done && clickable && "underline-offset-4 hover:underline",
                )}
              >
                {labels[i]}
              </span>
            </StepTag>
            {i < total - 1 ? (
              <span aria-hidden className="h-px w-6 bg-border" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
