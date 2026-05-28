"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database";
import {
  decline,
  optIn,
  withdrawOptIn,
} from "../../_actions/invitation.actions";

type Status = Database["public"]["Enums"]["invitation_status"];

export function InvitationActions({
  briefId,
  status,
}: {
  briefId: string;
  status: Status;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const wrap = (fn: () => Promise<unknown>) =>
    startTransition(async () => {
      await fn();
      router.refresh();
    });

  if (status === "expired") {
    return (
      <span className="rounded-full bg-surface px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        Expired
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "invited" ? (
        <>
          <Button
            type="button"
            variant="brand"
            size="lg"
            onClick={() => wrap(() => optIn(briefId))}
            disabled={pending}
          >
            <Check className="size-4" />
            Accept
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => wrap(() => decline(briefId))}
            disabled={pending}
          >
            <X className="size-4" />
            Decline
          </Button>
        </>
      ) : null}

      {status === "opted_in" ? (
        <>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-brand">
            <Check className="size-3" />
            Accepted
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => wrap(() => withdrawOptIn(briefId))}
            disabled={pending}
          >
            <Undo2 className="size-3.5" />
            Withdraw
          </Button>
        </>
      ) : null}

      {status === "declined" ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-ink/70">
          <X className="size-3" />
          Declined
        </span>
      ) : null}
    </div>
  );
}
