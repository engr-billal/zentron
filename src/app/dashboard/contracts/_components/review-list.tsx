import { Star } from "lucide-react";
import type { Tables } from "@/types/database";
import { cn } from "@/lib/utils";

type Review = Tables<"contract_reviews">;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ReviewList({
  reviews,
  brandName,
  creatorHandle,
  brandId,
}: {
  reviews: Review[];
  brandName: string;
  creatorHandle: string;
  brandId: string;
}) {
  if (reviews.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((r) => {
        const reviewerLabel =
          r.reviewer_id === brandId ? brandName : `@${creatorHandle}`;
        return (
          <article
            key={r.id}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-5"
          >
            <span aria-hidden className="absolute inset-x-5 top-0 h-px bg-brand" />
            <header className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
                  Review
                </p>
                <p className="mt-0.5 text-sm font-medium text-ink">
                  {reviewerLabel}
                </p>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={cn(
                      "size-4",
                      r.rating >= n ? "fill-brand text-brand" : "text-border",
                    )}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
            </header>
            {r.body ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/90">
                {r.body}
              </p>
            ) : null}
            <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {formatDate(r.created_at)}
            </p>
          </article>
        );
      })}
    </div>
  );
}
