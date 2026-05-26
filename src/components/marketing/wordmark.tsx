import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display tracking-tight text-ink",
        sizes[size],
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-block size-2 rounded-full bg-brand"
      />
      <span className="italic">Zentron</span>
      <span className="font-normal">Solutions</span>
    </span>
  );
}
