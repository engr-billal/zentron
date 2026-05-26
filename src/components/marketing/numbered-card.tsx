import { cn } from "@/lib/utils";

export function NumberedCard({
  number,
  title,
  children,
  className,
  tone = "light",
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-7 transition-all duration-300",
        tone === "light"
          ? "bg-card text-ink ring-1 ring-border hover:ring-brand/40 hover:shadow-[0_8px_30px_-12px_oklch(0.18_0.01_60_/_0.15)]"
          : "bg-ink text-paper ring-1 ring-ink hover:shadow-[0_8px_30px_-12px_oklch(0.18_0.01_60_/_0.4)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-7 top-0 h-px bg-brand transition-all duration-500 group-hover:inset-x-0"
      />
      <span
        className={cn(
          "text-[11px] font-medium tracking-[0.18em] uppercase",
          tone === "light" ? "text-brand" : "text-brand",
        )}
      >
        {number}
      </span>
      <h3
        className={cn(
          "font-display text-2xl leading-tight",
          tone === "light" ? "text-ink" : "text-paper",
        )}
      >
        {title}
      </h3>
      <div
        className={cn(
          "text-sm leading-relaxed",
          tone === "light" ? "text-muted-foreground" : "text-paper/70",
        )}
      >
        {children}
      </div>
    </div>
  );
}
