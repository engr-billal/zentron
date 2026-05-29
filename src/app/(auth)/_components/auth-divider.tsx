export function AuthDivider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span aria-hidden className="h-px flex-1 bg-border" />
      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        or
      </span>
      <span aria-hidden className="h-px flex-1 bg-border" />
    </div>
  );
}
