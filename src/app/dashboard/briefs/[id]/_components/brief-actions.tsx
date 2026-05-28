"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Send, Square, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database";
import {
  closeBrief,
  deleteBrief,
  publishBrief,
  reopenBrief,
} from "@/app/dashboard/briefs/new/_actions/brief.actions";

type Status = Database["public"]["Enums"]["brief_status"];

export function BriefActions({
  briefId,
  status,
}: {
  briefId: string;
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
            <Link href={`/dashboard/briefs/${briefId}/edit`}>
              <Pencil className="size-3.5" />
              Edit
            </Link>
          </Button>
          <Button
            type="button"
            variant="brand"
            size="sm"
            onClick={() => wrap(() => publishBrief(briefId))}
            disabled={pending}
          >
            <Send className="size-3.5" />
            Publish
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (
                confirm("Delete this brief? This cannot be undone.")
              ) {
                wrap(() => deleteBrief(briefId));
              }
            }}
            disabled={pending}
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </>
      ) : null}

      {status === "open" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => wrap(() => closeBrief(briefId))}
          disabled={pending}
        >
          <Square className="size-3.5" />
          Close brief
        </Button>
      ) : null}

      {status === "closed" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => wrap(() => reopenBrief(briefId))}
          disabled={pending}
        >
          <Undo2 className="size-3.5" />
          Reopen
        </Button>
      ) : null}
    </div>
  );
}
