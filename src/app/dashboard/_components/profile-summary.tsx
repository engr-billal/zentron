import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tables } from "@/types/database";
import { NICHE_LABELS } from "@/lib/constants/creator";
import type { Niche } from "@/lib/scoring/types";

type Creator = Tables<"creator_profiles">;
type Profile = Pick<Tables<"profiles">, "display_name" | "country">;

export function ProfileSummary({
  creator,
  profile,
}: {
  creator: Creator;
  profile: Profile;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-brand" />

      <div className="flex items-center justify-between border-b border-border bg-surface/60 px-6 py-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Your profile
        </p>
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center gap-1 text-xs font-medium text-ink hover:text-brand"
        >
          Edit
          <ArrowUpRight className="size-3" />
        </Link>
      </div>

      <dl className="grid gap-5 px-6 py-6 sm:grid-cols-2">
        <Item label="Handle" value={`@${creator.handle}`} />
        <Item
          label="Display name"
          value={profile.display_name ?? creator.handle}
        />
        <Item label="Country" value={profile.country ?? "—"} />
        <Item
          label="Languages"
          value={
            creator.languages.length > 0
              ? creator.languages.map((l) => l.toUpperCase()).join(", ")
              : "—"
          }
        />
        <Item
          label="Niches"
          value={
            creator.niches.length > 0
              ? creator.niches
                  .map((n) => NICHE_LABELS[n as Niche] ?? n)
                  .join(", ")
              : "—"
          }
          className="sm:col-span-2"
        />
        {creator.bio ? (
          <Item label="Bio" value={creator.bio} className="sm:col-span-2" />
        ) : null}
      </dl>
    </div>
  );
}

function Item({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  );
}
