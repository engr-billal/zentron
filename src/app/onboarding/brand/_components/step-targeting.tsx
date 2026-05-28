"use client";

import { Field } from "@/components/shared/field";
import {
  AUDIENCE_BAND_LABELS,
  AUDIENCE_SIZE_BANDS,
} from "@/lib/constants/brand";
import {
  CREATOR_PLATFORM_TYPES,
  NICHES,
  NICHE_LABELS,
  PLATFORM_LABELS,
} from "@/lib/constants/creator";
import type { BrandTargetingInput } from "@/lib/validations/brand";

type Props = {
  value: BrandTargetingInput;
  errors: Partial<Record<keyof BrandTargetingInput, string>>;
  onChange: (next: BrandTargetingInput) => void;
};

const ACTIVE_CHIP =
  "rounded-full bg-brand px-3 py-1 text-xs font-medium text-brand-foreground";
const INACTIVE_CHIP =
  "rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:border-brand/40";

export function StepTargeting({ value, errors, onChange }: Props) {
  const toggle = <K extends keyof BrandTargetingInput>(
    field: K,
    item: BrandTargetingInput[K] extends Array<infer T> ? T : never,
    max: number,
  ) => {
    const current = value[field] as unknown as Array<typeof item>;
    const next = current.includes(item)
      ? current.filter((x) => x !== item)
      : [...current, item].slice(0, max);
    onChange({ ...value, [field]: next } as BrandTargetingInput);
  };

  return (
    <div className="flex flex-col gap-6">
      <Field
        label="Default niches (optional)"
        htmlFor="default_niches"
        hint="What niches do you typically run campaigns in? Up to 5."
        error={errors.default_niches}
      >
        <div className="flex flex-wrap gap-2">
          {NICHES.map((n) => {
            const active = value.default_niches.includes(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => toggle("default_niches", n, 5)}
                className={active ? ACTIVE_CHIP : INACTIVE_CHIP}
              >
                {NICHE_LABELS[n]}
              </button>
            );
          })}
        </div>
      </Field>

      <Field
        label="Default platforms (optional)"
        htmlFor="default_platforms"
        hint="Where your campaigns usually live."
        error={errors.default_platforms}
      >
        <div className="flex flex-wrap gap-2">
          {CREATOR_PLATFORM_TYPES.map((p) => {
            const active = value.default_platforms.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => toggle("default_platforms", p, 6)}
                className={active ? ACTIVE_CHIP : INACTIVE_CHIP}
              >
                {PLATFORM_LABELS[p]}
              </button>
            );
          })}
        </div>
      </Field>

      <Field
        label="Typical audience size bands (optional)"
        htmlFor="default_audience_bands"
        hint="Creator sizes you tend to work with."
        error={errors.default_audience_bands}
      >
        <div className="flex flex-wrap gap-2">
          {AUDIENCE_SIZE_BANDS.map((b) => {
            const active = value.default_audience_bands.includes(b);
            return (
              <button
                key={b}
                type="button"
                onClick={() => toggle("default_audience_bands", b, 5)}
                className={active ? ACTIVE_CHIP : INACTIVE_CHIP}
              >
                {AUDIENCE_BAND_LABELS[b]}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}
