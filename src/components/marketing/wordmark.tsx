import Image from "next/image";
import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const logoSizes = {
    sm: { width: 124, height: 20 },
    md: { width: 156, height: 25 },
    lg: { width: 188, height: 30 },
  } as const;
  const dims = logoSizes[size];

  return (
    <span
      className={cn(
        "inline-flex items-center",
        className,
      )}
    >
      <Image
        src="/ORANGE LOGO (2).png"
        alt="Zentron Solutions"
        width={dims.width}
        height={dims.height}
        priority={size !== "sm"}
        className="h-auto w-auto max-w-none"
      />
    </span>
  );
}
