import { Link as LinkIcon } from "lucide-react";
import type { Tables } from "@/types/database";
import type { UserRole } from "@/lib/permissions";
import { MilestoneStatusBadge } from "./milestone-status-badge";
import { MilestoneSubmissionForm } from "./milestone-submission-form";
import { MilestoneBrandReview } from "./milestone-brand-review";

type Milestone = Tables<"milestones">;

function formatMoney(cents: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  return `${symbol}${(cents / 100).toLocaleString("en-GB", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function MilestoneList({
  milestones,
  currency,
  role,
  contractStatus,
}: {
  milestones: Milestone[];
  currency: string;
  role?: UserRole;
  contractStatus?: string;
}) {
  if (milestones.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No milestones defined.</p>
    );
  }

  const isActive = contractStatus === "active";

  return (
    <ul className="flex flex-col gap-3">
      {milestones.map((m) => {
        const showCreatorForm =
          isActive &&
          role === "creator" &&
          (m.status === "pending" || m.status === "rejected");
        const showBrandReview =
          isActive &&
          role === "brand" &&
          (m.status === "submitted" || m.status === "approved");
        const hasSubmission =
          m.status !== "pending" &&
          ((m.submission_notes && m.submission_notes.length > 0) ||
            (m.submission_urls?.length ?? 0) > 0);

        return (
          <li
            key={m.id}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-4"
          >
            <span aria-hidden className="absolute inset-x-4 top-0 h-px bg-brand" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex flex-col gap-1">
                <p className="flex items-center gap-2 font-medium text-ink">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-brand">
                    M{String(m.sequence).padStart(2, "0")}
                  </span>
                  {m.title}
                </p>
                {m.description ? (
                  <p className="text-xs text-muted-foreground">
                    {m.description}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col items-end gap-1 text-right">
                <MilestoneStatusBadge status={m.status} />
                <p className="font-display text-lg leading-none text-ink tabular-nums">
                  {formatMoney(m.amount_cents, currency)}
                </p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  Due {formatDate(m.due_at)}
                </p>
              </div>
            </div>

            {hasSubmission ? (
              <div className="mt-3 rounded-lg border border-border bg-surface/40 p-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {m.status === "rejected"
                    ? "Last submission"
                    : "Creator submission"}
                </p>
                {m.submission_notes ? (
                  <p className="mt-1.5 whitespace-pre-line text-sm text-ink/90">
                    {m.submission_notes}
                  </p>
                ) : null}
                {m.submission_urls?.length ? (
                  <ul className="mt-2 flex flex-col gap-1">
                    {m.submission_urls.map((url) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-brand hover:underline"
                        >
                          <LinkIcon className="size-3" />
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Submitted {formatDate(m.submitted_at)}
                </p>
              </div>
            ) : null}

            {m.status === "rejected" && m.rejection_reason ? (
              <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-destructive">
                  Brand requested changes
                </p>
                <p className="mt-1.5 whitespace-pre-line text-sm text-ink/90">
                  {m.rejection_reason}
                </p>
              </div>
            ) : null}

            {m.status === "released" && m.released_at ? (
              <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-brand">
                Released {formatDate(m.released_at)}
              </p>
            ) : null}

            {showCreatorForm ? (
              <MilestoneSubmissionForm
                milestoneId={m.id}
                initialNotes={m.submission_notes ?? ""}
                initialUrls={m.submission_urls ?? []}
                resubmit={m.status === "rejected"}
              />
            ) : null}

            {showBrandReview ? (
              <MilestoneBrandReview
                milestoneId={m.id}
                status={m.status as "submitted" | "approved"}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
