"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, selectClass } from "@/components/shared/field";
import {
  DELIVERABLE_LABELS,
  DELIVERABLE_TYPES,
} from "@/lib/constants/brand";
import {
  CREATOR_PLATFORM_TYPES,
  PLATFORM_LABELS,
} from "@/lib/constants/creator";
import type {
  BriefDeliverableInput,
  BriefDeliverablesInput,
} from "@/lib/validations/brief";

type Props = {
  value: BriefDeliverablesInput;
  errors: Partial<Record<keyof BriefDeliverablesInput, string>>;
  onChange: (next: BriefDeliverablesInput) => void;
};

const ACTIVE_CHIP =
  "rounded-full bg-brand px-3 py-1 text-xs font-medium text-brand-foreground";
const INACTIVE_CHIP =
  "rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:border-brand/40";

const emptyDeliverable: BriefDeliverableInput = {
  type: "reel",
  count: 1,
  specs: "",
};

export function StepDeliverables({ value, errors, onChange }: Props) {
  const togglePlatform = (
    p: (typeof CREATOR_PLATFORM_TYPES)[number],
  ) => {
    const next = value.platforms.includes(p)
      ? value.platforms.filter((x) => x !== p)
      : [...value.platforms, p];
    onChange({ ...value, platforms: next });
  };

  const updateRow = (i: number, next: Partial<BriefDeliverableInput>) => {
    onChange({
      ...value,
      deliverables: value.deliverables.map((d, idx) =>
        idx === i ? { ...d, ...next } : d,
      ),
    });
  };

  const removeRow = (i: number) => {
    if (value.deliverables.length === 1) return;
    onChange({
      ...value,
      deliverables: value.deliverables.filter((_, idx) => idx !== i),
    });
  };

  const addRow = () => {
    if (value.deliverables.length >= 10) return;
    onChange({ ...value, deliverables: [...value.deliverables, emptyDeliverable] });
  };

  return (
    <div className="flex flex-col gap-6">
      <Field
        label="Platforms"
        htmlFor="platforms"
        hint="Pick at least one. Drives matching weight."
        error={errors.platforms}
      >
        <div className="flex flex-wrap gap-2">
          {CREATOR_PLATFORM_TYPES.map((p) => {
            const active = value.platforms.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={active ? ACTIVE_CHIP : INACTIVE_CHIP}
              >
                {PLATFORM_LABELS[p]}
              </button>
            );
          })}
        </div>
      </Field>

      <Field
        label="Deliverables"
        htmlFor="deliverables"
        hint="What does the creator produce? Add rows for each deliverable type."
        error={errors.deliverables}
      >
        <div className="flex flex-col gap-3">
          {value.deliverables.map((row, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl border border-border bg-card p-4"
            >
              <span aria-hidden className="absolute inset-x-4 top-0 h-px bg-brand" />
              <div className="grid gap-3 sm:grid-cols-[1fr_120px_auto]">
                <select
                  value={row.type}
                  onChange={(e) =>
                    updateRow(i, {
                      type: e.target.value as BriefDeliverableInput["type"],
                    })
                  }
                  className={selectClass}
                >
                  {DELIVERABLE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {DELIVERABLE_LABELS[t]}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={row.count}
                  onChange={(e) =>
                    updateRow(i, { count: Number(e.target.value) || 1 })
                  }
                />
                {value.deliverables.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeRow(i)}
                    aria-label="Remove deliverable"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                ) : (
                  <span className="size-8" />
                )}
              </div>
              <Input
                value={row.specs ?? ""}
                onChange={(e) => updateRow(i, { specs: e.target.value })}
                placeholder="Specs (optional): tone, hashtags, links, talking points"
                className="mt-2"
              />
            </div>
          ))}
        </div>
        {value.deliverables.length < 10 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addRow}
            className="mt-2 self-start"
          >
            <Plus className="size-3.5" />
            Add deliverable
          </Button>
        ) : null}
      </Field>
    </div>
  );
}
