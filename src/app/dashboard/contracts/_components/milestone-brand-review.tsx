"use client";

import { useState, useTransition } from "react";
import { Check, Coins, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { textareaClass } from "@/components/shared/field";
import {
  approveMilestone,
  rejectMilestone,
  releaseMilestone,
} from "../_actions/milestone.actions";

export function MilestoneBrandReview({
  milestoneId,
  status,
}: {
  milestoneId: string;
  status: "submitted" | "approved";
}) {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const wrap = (fn: () => Promise<{ error: string } | unknown>) => {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (result && typeof result === "object" && "error" in result) {
        setError((result as { error: string }).error);
      }
    });
  };

  if (status === "approved") {
    return (
      <div className="mt-3 flex flex-col gap-2 rounded-lg border border-dashed border-brand/30 bg-brand/5 p-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-brand">
          Approved — ready to release
        </p>
        <p className="text-xs text-muted-foreground">
          Releasing marks this milestone as paid in our records. Real escrow
          payouts ship in a later phase — for now this just closes the
          milestone on the contract.
        </p>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <Button
          type="button"
          variant="brand"
          size="sm"
          onClick={() => {
            if (confirm("Mark this milestone as released?")) {
              wrap(() => releaseMilestone(milestoneId));
            }
          }}
          disabled={pending}
          className="self-start"
        >
          <Coins className="size-3.5" />
          Mark released
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3 rounded-lg border border-dashed border-brand/30 bg-brand/5 p-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-brand">
        Review submission
      </p>

      {showReject ? (
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`reject-${milestoneId}`}
            className="text-sm font-medium text-ink"
          >
            What needs to change?
          </label>
          <textarea
            id={`reject-${milestoneId}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={1000}
            rows={3}
            className={textareaClass}
            placeholder="Reels need a clear product shot in the first 2s..."
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => wrap(() => rejectMilestone(milestoneId, reason))}
              disabled={pending}
            >
              <X className="size-3.5" />
              Send back
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowReject(false);
                setReason("");
                setError(null);
              }}
              disabled={pending}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="brand"
              size="sm"
              onClick={() => wrap(() => approveMilestone(milestoneId))}
              disabled={pending}
            >
              <Check className="size-3.5" />
              Approve
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowReject(true)}
              disabled={pending}
            >
              <Pencil className="size-3.5" />
              Request changes
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
