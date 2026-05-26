export function AuthCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-[0_24px_60px_-24px_oklch(0.18_0.01_60_/_0.12)]">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-brand"
      />
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-display text-3xl leading-tight text-ink">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}
