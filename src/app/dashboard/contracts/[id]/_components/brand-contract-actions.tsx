"use client";

import { useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, Pencil, Send, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database";
import {
  cancelContract,
  deleteContract,
  markCompleted,
  sendContract,
} from "@/app/dashboard/contracts/new/_actions/contract.actions";

type Status = Database["public"]["Enums"]["contract_status"];

export function BrandContractActions({
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
      {status === "draft" ? (
        <>
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/contracts/${contractId}/edit`}>
              <Pencil className="size-3.5" />
              Edit
            </Link>
          </Button>
          <Button
            type="button"
            variant="brand"
            size="sm"
            onClick={() => wrap(() => sendContract(contractId))}
            disabled={pending}
          >
            <Send className="size-3.5" />
            Send to creator
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Delete this draft contract? This cannot be undone.")) {
                wrap(() => deleteContract(contractId));
              }
            }}
            disabled={pending}
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </>
      ) : null}

      {status === "pending_creator" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            if (confirm("Withdraw this contract before the creator responds?")) {
              wrap(() => cancelContract(contractId, "Withdrawn by brand"));
            }
          }}
          disabled={pending}
        >
          <Undo2 className="size-3.5" />
          Withdraw
        </Button>
      ) : null}

      {status === "active" ? (
        <>
          <Button
            type="button"
            variant="brand"
            size="sm"
            onClick={() => {
              if (
                confirm(
                  "Mark this contract as completed? Use this if work is done outside the milestone flow.",
                )
              ) {
                wrap(() => markCompleted(contractId));
              }
            }}
            disabled={pending}
          >
            <CheckCircle2 className="size-3.5" />
            Mark complete
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const reason = prompt("Reason for cancellation? (optional)");
              if (confirm("Cancel this active contract?")) {
                wrap(() => cancelContract(contractId, reason ?? undefined));
              }
            }}
            disabled={pending}
          >
            <Undo2 className="size-3.5" />
            Cancel
          </Button>
        </>
      ) : null}
    </div>
  );
}
