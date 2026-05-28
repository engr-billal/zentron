export function ScoreDimensionRow({
  number,
  label,
  value,
  weight,
  note,
}: {
  number: string;
  label: string;
  value: number;
  weight: number;
  note?: string;
}) {
  return (
    <li className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-2 text-muted-foreground">
          <span className="text-brand">{number}</span>
          {label}
          {note ? (
            <span className="text-muted-foreground/70">· {note}</span>
          ) : null}
        </span>
        <span className="font-medium tabular-nums text-ink">
          {value} × {weight.toFixed(2)}
        </span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </li>
  );
}
