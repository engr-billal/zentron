import Link from "next/link";
import { DIMENSION_WEIGHTS } from "@/lib/scoring/types";

export function ScoreExplainer() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        How scoring works
      </p>
      <h2 className="mt-2 font-display text-xl text-ink">
        Your Zentron Score is transparent.
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Brands see the same number and fair-rate band you do. Scores refresh when
        you update platforms or complete contracts.
      </p>
      <ul className="mt-4 flex flex-col gap-2 text-sm text-ink/90">
        <li>
          <strong>Audience size</strong> — {Math.round(DIMENSION_WEIGHTS.audienceSize * 100)}% weight
        </li>
        <li>
          <strong>Engagement</strong> — {Math.round(DIMENSION_WEIGHTS.engagement * 100)}% weight
        </li>
        <li>
          <strong>Niche premium</strong> — {Math.round(DIMENSION_WEIGHTS.niche * 100)}% weight
        </li>
        <li>
          <strong>Platform</strong> — {Math.round(DIMENSION_WEIGHTS.platform * 100)}% weight
        </li>
        <li>
          <strong>Track record</strong> — {Math.round(DIMENSION_WEIGHTS.trackRecord * 100)}% weight
        </li>
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">
        <strong className="text-ink">Improve your score:</strong> keep platform
        stats current, deliver milestones on time, and earn strong brand reviews.
      </p>
      <Link
        href="/dashboard/platforms"
        className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
      >
        Update your platforms →
      </Link>
    </div>
  );
}
