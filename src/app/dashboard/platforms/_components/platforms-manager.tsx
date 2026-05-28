"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLATFORM_LABELS } from "@/lib/constants/creator";
import type { Tables } from "@/types/database";
import { PlatformForm } from "./platform-form";
import { deletePlatform } from "../_actions/platform.actions";

type Platform = Tables<"creator_platforms">;

type Mode =
  | { kind: "view" }
  | { kind: "add" }
  | { kind: "edit"; platformId: string };

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function PlatformsManager({
  initial,
  primary,
}: {
  initial: Platform[];
  primary: Platform["platform"];
}) {
  const [mode, setMode] = useState<Mode>({ kind: "view" });
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleDelete = (platformId: string) => {
    if (!confirm("Remove this platform? Your score will be recomputed.")) return;
    setPendingDeleteId(platformId);
    startTransition(async () => {
      await deletePlatform(platformId);
      setPendingDeleteId(null);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {initial.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-border bg-surface/40 p-8 text-center text-sm text-muted-foreground">
            You haven&apos;t added any platforms yet.
          </li>
        ) : (
          initial.map((p) => {
            const isEditing = mode.kind === "edit" && mode.platformId === p.id;
            const isDeleting = pendingDeleteId === p.id;
            return (
              <li
                key={p.id}
                className="relative overflow-hidden rounded-2xl border border-border bg-card"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-brand" />
                <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-ink">
                      {PLATFORM_LABELS[p.platform]}
                      {p.platform === primary ? (
                        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-brand">
                          Primary
                        </span>
                      ) : null}
                      {p.verified ? (
                        <CheckCircle2 className="size-3.5 text-brand" />
                      ) : null}
                    </p>
                    <p className="text-xs text-muted-foreground">{p.handle}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-display text-base text-ink tabular-nums">
                        {formatFollowers(p.followers)}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {(Number(p.avg_engagement_rate) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Edit"
                        onClick={() =>
                          setMode({ kind: "edit", platformId: p.id })
                        }
                        disabled={isEditing}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Delete"
                        onClick={() => handleDelete(p.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
                {isEditing ? (
                  <div className="border-t border-border bg-surface/40 px-5 py-5">
                    <PlatformForm
                      mode="edit"
                      row={p}
                      onDone={() => setMode({ kind: "view" })}
                    />
                  </div>
                ) : null}
              </li>
            );
          })
        )}
      </ul>

      {mode.kind === "add" ? (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-5 py-5">
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-brand" />
          <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-brand">
            Add platform
          </p>
          <PlatformForm
            mode="add"
            onDone={() => setMode({ kind: "view" })}
          />
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setMode({ kind: "add" })}
          className="self-start"
        >
          <Plus className="size-3.5" />
          Add platform
        </Button>
      )}
    </div>
  );
}
