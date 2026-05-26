import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  className,
  children,
  bordered = true,
}: {
  id?: string;
  eyebrow?: { number: string; label: string };
  className?: string;
  children: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full px-6 py-24 sm:px-10 lg:py-32",
        bordered && "border-t border-border/70",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl">
        {eyebrow ? (
          <div className="mb-12 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span className="text-brand">{eyebrow.number}</span>
            <span aria-hidden className="h-px w-6 bg-border" />
            <span>{eyebrow.label}</span>
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
