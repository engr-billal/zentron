const tags = [
  "Brief wizard",
  "Creator matching",
  "Zentron Score",
  "Contracts",
  "Milestone tracking",
  "Invite links",
  "Reviews",
  "Brand dashboard",
  "Creator profile",
  "Campaign view",
];

export function Marquee() {
  const items = [...tags, ...tags];
  return (
    <div
      aria-hidden
      className="relative w-full overflow-hidden border-y border-border/70 bg-surface/60 py-3.5"
    >
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-sm text-muted-foreground">
        {items.map((tag, i) => (
          <span key={`${tag}-${i}`} className="inline-flex items-center gap-3">
            <span className="size-1 rounded-full bg-brand/70" />
            <span>{tag}</span>
          </span>
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent"
      />
    </div>
  );
}
