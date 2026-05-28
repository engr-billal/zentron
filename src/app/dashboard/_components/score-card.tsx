import { CheckCircle2 } from "lucide-react";
import type { Tables } from "@/types/database";
import { DIMENSION_WEIGHTS } from "@/lib/scoring/types";
import { ScoreDimensionRow } from "./score-dimension-row";

type Score = Tables<"creator_scores">;

const BAND_LABELS: Record<Score["audience_size_band"], string> = {
  nano: "Nano (1K–10K)",
  micro: "Micro (10K–100K)",
  mid: "Mid (100K–500K)",
  macro: "Macro (500K–1M)",
  mega: "Mega (1M+)",
};

function topPercentile(score: number): string {
  if (score >= 95) return "Top 0.4%";
  if (score >= 90) return "Top 1%";
  if (score >= 85) return "Top 5%";
  if (score >= 75) return "Top 25%";
  return "Building";
}

function formatMoney(cents: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  return `${symbol}${(cents / 100).toLocaleString("en-GB", {
    maximumFractionDigits: 0,
  })}`;
}

export function ScoreCard({ score }: { score: Score }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-brand" />

      <div className="flex items-center justify-between border-b border-border bg-surface/60 px-6 py-3">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-brand" />
          Your Zentron Score
        </div>
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {BAND_LABELS[score.audience_size_band]} · v{score.algo_version.slice(1)}
        </span>
      </div>

      <div className="grid gap-6 px-6 py-6 sm:grid-cols-[auto_1fr] sm:gap-10">
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-ink p-6 text-paper sm:w-48">
          <span className="font-display text-7xl leading-none text-brand">
            {score.final_score}
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-paper/60">
            out of 100
          </span>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-paper/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-paper/80">
            {topPercentile(score.final_score)}
          </span>
        </div>

        <ul className="flex flex-col gap-3">
          <ScoreDimensionRow
            number="01"
            label="Audience size"
            value={
              score.audience_size_band === "mega"
                ? 95
                : score.audience_size_band === "macro"
                  ? 90
                  : score.audience_size_band === "mid"
                    ? 82
                    : score.audience_size_band === "micro"
                      ? 72
                      : 60
            }
            weight={DIMENSION_WEIGHTS.audienceSize}
          />
          <ScoreDimensionRow
            number="02"
            label="Engagement"
            value={score.engagement_score}
            weight={DIMENSION_WEIGHTS.engagement}
          />
          <ScoreDimensionRow
            number="03"
            label="Niche premium"
            value={score.niche_score}
            weight={DIMENSION_WEIGHTS.niche}
            note={`${Number(score.niche_multiplier).toFixed(1)}× multiplier`}
          />
          <ScoreDimensionRow
            number="04"
            label="Platform"
            value={score.platform_score}
            weight={DIMENSION_WEIGHTS.platform}
          />
          <ScoreDimensionRow
            number="05"
            label="Track record"
            value={score.track_record_score}
            weight={DIMENSION_WEIGHTS.trackRecord}
          />
        </ul>
      </div>

      <div className="flex flex-col gap-2 border-t border-border bg-surface/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-muted-foreground">
          <span className="font-medium uppercase tracking-[0.14em] text-brand">
            Fair range
          </span>{" "}
          <span className="font-medium tabular-nums text-ink">
            {formatMoney(score.suggested_min_cents, score.currency)}
          </span>
          {" – "}
          <span className="font-medium tabular-nums text-ink">
            {formatMoney(score.suggested_max_cents, score.currency)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-brand" />
          Both sides see the same range
        </div>
      </div>
    </div>
  );
}
