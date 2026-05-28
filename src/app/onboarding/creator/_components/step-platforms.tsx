"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CREATOR_PLATFORM_TYPES,
  PLATFORM_LABELS,
} from "@/lib/constants/creator";
import { Field, selectClass } from "@/components/shared/field";
import type { CreatorPlatformInput } from "@/lib/validations/creator";

type Props = {
  value: CreatorPlatformInput[];
  errors: Array<Partial<Record<keyof CreatorPlatformInput, string>>>;
  onChange: (next: CreatorPlatformInput[]) => void;
};

const emptyRow: CreatorPlatformInput = {
  platform: "instagram",
  handle: "",
  followers: 0,
  avg_engagement_rate: 0.02,
  audience_health_score: 80,
  verified: false,
};

export function StepPlatforms({ value, errors, onChange }: Props) {
  const updateRow = (i: number, next: Partial<CreatorPlatformInput>) => {
    onChange(value.map((row, idx) => (idx === i ? { ...row, ...next } : row)));
  };
  const removeRow = (i: number) => {
    if (value.length === 1) return;
    onChange(value.filter((_, idx) => idx !== i));
  };
  const addRow = () => {
    if (value.length >= 6) return;
    onChange([...value, emptyRow]);
  };

  return (
    <div className="flex flex-col gap-5">
      {value.map((row, i) => {
        const rowErrors = errors[i] ?? {};
        return (
          <div
            key={i}
            className="relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
          >
            <span
              aria-hidden
              className="absolute inset-x-5 top-0 h-px bg-brand"
            />
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
                Platform {String(i + 1).padStart(2, "0")}
              </p>
              {value.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3" />
                  Remove
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Platform"
                htmlFor={`platform-${i}`}
                error={rowErrors.platform}
              >
                <select
                  id={`platform-${i}`}
                  value={row.platform}
                  onChange={(e) =>
                    updateRow(i, {
                      platform: e.target.value as CreatorPlatformInput["platform"],
                    })
                  }
                  className={selectClass}
                >
                  {CREATOR_PLATFORM_TYPES.map((p) => (
                    <option key={p} value={p}>
                      {PLATFORM_LABELS[p]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Handle"
                htmlFor={`handle-${i}`}
                error={rowErrors.handle}
              >
                <Input
                  id={`handle-${i}`}
                  value={row.handle}
                  onChange={(e) => updateRow(i, { handle: e.target.value })}
                  placeholder="@kira.studio"
                  required
                />
              </Field>

              <Field
                label="Followers"
                htmlFor={`followers-${i}`}
                error={rowErrors.followers}
              >
                <Input
                  id={`followers-${i}`}
                  type="number"
                  min={0}
                  value={row.followers}
                  onChange={(e) =>
                    updateRow(i, { followers: Number(e.target.value) || 0 })
                  }
                />
              </Field>

              <Field
                label="Avg engagement rate"
                htmlFor={`engagement-${i}`}
                hint="0-1 (e.g. 0.038 = 3.8%)."
                error={rowErrors.avg_engagement_rate}
              >
                <Input
                  id={`engagement-${i}`}
                  type="number"
                  min={0}
                  max={1}
                  step={0.001}
                  value={row.avg_engagement_rate}
                  onChange={(e) =>
                    updateRow(i, {
                      avg_engagement_rate: Number(e.target.value) || 0,
                    })
                  }
                />
              </Field>

              <Field
                label="Audience health (0-100)"
                htmlFor={`health-${i}`}
                hint="Lower = more bots/inactive. Manual for now."
                error={rowErrors.audience_health_score}
                className="sm:col-span-2"
              >
                <Input
                  id={`health-${i}`}
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={row.audience_health_score}
                  onChange={(e) =>
                    updateRow(i, {
                      audience_health_score: Number(e.target.value) || 0,
                    })
                  }
                />
              </Field>
            </div>
          </div>
        );
      })}

      {value.length < 6 ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          className="self-start"
        >
          <Plus className="size-3.5" />
          Add another platform
        </Button>
      ) : null}
    </div>
  );
}
