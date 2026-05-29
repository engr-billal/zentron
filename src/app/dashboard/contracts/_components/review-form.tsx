"use client";

import { useState, useTransition } from "react";
import { Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { textareaClass } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { submitContractReview } from "../_actions/review.actions";

export function ReviewForm({
  contractId,
  counterpartyName,
}: {
  contractId: string;
  counterpartyName: string;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = () => {
    if (rating < 1) {
      setError("Pick a rating from 1 to 5 stars.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await submitContractReview(contractId, {
        rating,
        body: body.trim(),
      });
      if (result && "error" in result) {
        setError(result.error);
      }
    });
  };

  const display = hover || rating;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
          Leave a review
        </p>
        <h3 className="mt-1 font-display text-xl text-ink">
          Rate working with {counterpartyName}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Reviews show on the contract and feed into the Zentron Score for
          creators. You can&apos;t edit a review after sending.
        </p>
      </div>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            className="rounded-md p-1 transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "size-7",
                display >= n ? "fill-brand text-brand" : "text-border",
              )}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={2000}
        rows={3}
        className={textareaClass}
        placeholder="Anything specific you want to call out? (optional)"
      />

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      <Button
        type="button"
        variant="brand"
        size="sm"
        onClick={onSubmit}
        disabled={pending}
        className="self-start"
      >
        <Send className="size-3.5" />
        {pending ? "Sending..." : "Send review"}
      </Button>
    </div>
  );
}
