import type { Tables } from "@/types/database";
import {
  AUDIENCE_BAND_LABELS,
  DELIVERABLE_LABELS,
  type DeliverableType,
} from "@/lib/constants/brand";
import { NICHE_LABELS, PLATFORM_LABELS } from "@/lib/constants/creator";
import type { Niche } from "@/lib/scoring/types";
import type { BriefTargetAudienceJson } from "@/lib/validations/brief";
import type { BriefDeliverableInput } from "@/lib/validations/brief";
import type { Database } from "@/types/database";

type Brief = Tables<"briefs">;
type Band = Database["public"]["Enums"]["audience_size_band"];

function formatMoney(cents: number | null, currency: string | null): string {
  if (cents === null) return "—";
  const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  return `${symbol}${(cents / 100).toLocaleString("en-GB", {
    maximumFractionDigits: 0,
  })}`;
}

export function BriefDetail({ brief }: { brief: Brief }) {
  const ta = (brief.target_audience ?? {}) as Partial<BriefTargetAudienceJson>;
  const deliverables =
    (brief.deliverables as unknown as BriefDeliverableInput[]) ?? [];

  return (
    <div className="flex flex-col gap-8">
      {brief.objective ? (
        <Block title="Objective">
          <p className="text-pretty text-ink/90">{brief.objective}</p>
        </Block>
      ) : null}

      <Block title="Match parameters">
        <Row
          label="Niche"
          value={
            brief.niche
              ? (NICHE_LABELS[brief.niche as Niche] ?? brief.niche)
              : "—"
          }
        />
        <Row
          label="Platforms"
          value={
            brief.platforms.length
              ? brief.platforms
                  .map((p) => PLATFORM_LABELS[p as keyof typeof PLATFORM_LABELS] ?? p)
                  .join(", ")
              : "—"
          }
        />
        <Row
          label="Audience sizes"
          value={
            ta.audience_size_bands?.length
              ? ta.audience_size_bands
                  .map((b) => AUDIENCE_BAND_LABELS[b as Band])
                  .join(", ")
              : "Any"
          }
        />
        <Row
          label="Countries"
          value={ta.countries?.length ? ta.countries.join(", ") : "Global"}
        />
        <Row
          label="Age range"
          value={
            ta.age_min || ta.age_max
              ? `${ta.age_min ?? "?"}–${ta.age_max ?? "?"}`
              : "Any"
          }
        />
      </Block>

      <Block title="Deliverables">
        {deliverables.length === 0 ? (
          <p className="text-sm text-muted-foreground">No deliverables.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {deliverables.map((d, i) => (
              <li
                key={i}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg bg-surface/60 px-3 py-2 text-sm"
              >
                <span className="font-medium text-ink">
                  {DELIVERABLE_LABELS[d.type as DeliverableType] ?? d.type}{" "}
                  <span className="text-muted-foreground">× {d.count}</span>
                </span>
                {d.specs ? (
                  <span className="text-xs text-muted-foreground">
                    {d.specs}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Block>

      <Block title="Budget">
        <Row
          label="Range"
          value={`${formatMoney(brief.budget_min_cents, brief.currency)} – ${formatMoney(brief.budget_max_cents, brief.currency)}`}
        />
        <Row label="Currency" value={brief.currency ?? "USD"} />
      </Block>

      {brief.exclusivity || brief.usage_rights ? (
        <Block title="Terms">
          {brief.exclusivity ? (
            <Row label="Exclusivity" value={brief.exclusivity} />
          ) : null}
          {brief.usage_rights ? (
            <Row label="Usage rights" value={brief.usage_rights} />
          ) : null}
        </Block>
      ) : null}
    </div>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] uppercase tracking-[0.18em] text-brand">
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-pretty text-ink/90">{value}</span>
    </div>
  );
}
