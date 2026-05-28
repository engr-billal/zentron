"use client";

import { useTransition } from "react";
import { Check, Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database";
import {
  cancelContract,
  declineContract,
  signContract,
} from "@/app/dashboard/contracts/new/_actions/contract.actions";

type Status = Database["public"]["Enums"]["contract_status"];

export function CreatorContractActions({
  contractId,
  status,
}: {
  contractId: string;
  status: Status;
}) {
  const [pending, startTransition] = useTransition();

  const wrap = (fn: () => Promise<unknown>) =>
    startTransition(async () => {
      await fn();
    });

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "pending_creator" ? (
        <>
          <Button
            type="button"
            variant="brand"
            size="lg"
            onClick={() => {
              if (confirm("Sign and accept this contract?")) {
                wrap(() => signContract(contractId));
              }
            }}
            disabled={pending}
          >
            <Check className="size-4" />
            Sign & accept
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              if (confirm("Decline this contract?")) {
                wrap(() => declineContract(contractId));
              }
            }}
            disabled={pending}
          >
            <X className="size-4" />
            Decline
          </Button>
        </>
      ) : null}

      {status === "active" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const reason = prompt("Reason for cancellation? (optional)");
            if (
              confirm(
                "Cancel this active contract? Phase 4 will handle refunds.",
              )
            ) {
              wrap(() => cancelContract(contractId, reason ?? undefined));
            }
          }}
          disabled={pending}
        >
          <Undo2 className="size-3.5" />
          Cancel
        </Button>
      ) : null}
    </div>
  );
}
