import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  className,
  children,
  bordered = true,
}: {
  id?: string;
  eyebrow?: string;
  className?: string;
  children: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full px-6 py-24 sm:px-10 lg:py-28",
        bordered && "border-t border-border/70",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl">
        {eyebrow ? (
          <p className="mb-10 text-[11px] font-medium uppercase tracking-[0.18em] text-brand">
            {eyebrow}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
