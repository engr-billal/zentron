export function centsToMajor(cents: number | undefined | null): string {
  if (cents === undefined || cents === null) return "";
  return (cents / 100).toFixed(2).replace(/\.?0+$/, "");
}

export function majorToCents(major: string): number | undefined {
  const trimmed = major.trim();
  if (!trimmed) return undefined;
  const parsed = Number.parseFloat(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return Math.round(parsed * 100);
}
