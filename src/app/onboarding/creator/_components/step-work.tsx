"use client";

import { Input } from "@/components/ui/input";
import {
  CREATOR_PLATFORM_TYPES,
  CURRENCIES,
  NICHE_LABELS,
  NICHES,
  PLATFORM_LABELS,
} from "@/lib/constants/creator";
import { Field, selectClass } from "@/components/shared/field";
import type { CreatorWorkInput } from "@/lib/validations/creator";

type Props = {
  value: CreatorWorkInput;
  errors: Partial<Record<keyof CreatorWorkInput, string>>;
  onChange: (next: CreatorWorkInput) => void;
};

export function StepWork({ value, errors, onChange }: Props) {
  const toggleNiche = (niche: (typeof NICHES)[number]) => {
    const exists = value.niches.includes(niche);
    const next = exists
      ? value.niches.filter((n) => n !== niche)
      : [...value.niches, niche].slice(0, 3);
    onChange({ ...value, niches: next });
  };

  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Niches"
        htmlFor="niches"
        hint="Pick 1-3. Niche pricing multipliers drive your suggested rate."
        error={errors.niches}
      >
        <div className="flex flex-wrap gap-2">
          {NICHES.map((niche) => {
            const active = value.niches.includes(niche);
            return (
              <button
                key={niche}
                type="button"
                onClick={() => toggleNiche(niche)}
                className={
                  active
                    ? "rounded-full bg-brand px-3 py-1 text-xs font-medium text-brand-foreground"
                    : "rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:border-brand/40"
                }
              >
                {NICHE_LABELS[niche]}
              </button>
            );
          })}
        </div>
      </Field>

      <Field
        label="Primary platform"
        htmlFor="primary_platform"
        hint="Where most of your audience lives. Drives platform-format weighting."
        error={errors.primary_platform}
      >
        <select
          id="primary_platform"
          name="primary_platform"
          value={value.primary_platform}
          onChange={(e) =>
            onChange({
              ...value,
              primary_platform: e.target
                .value as CreatorWorkInput["primary_platform"],
            })
          }
          className={selectClass}
          required
        >
          {CREATOR_PLATFORM_TYPES.map((p) => (
            <option key={p} value={p}>
              {PLATFORM_LABELS[p]}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Base rate (optional)"
        htmlFor="base_rate"
        hint="Your floor in cents. Used as a sanity check against the suggested range."
        error={errors.base_rate_cents}
      >
        <div className="flex gap-2">
          <select
            value={value.currency}
            onChange={(e) =>
              onChange({
                ...value,
                currency: e.target.value as CreatorWorkInput["currency"],
              })
            }
            className={`${selectClass} w-24`}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Input
            id="base_rate"
            name="base_rate_cents"
            type="number"
            min={0}
            step={1}
            value={value.base_rate_cents ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                base_rate_cents: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            placeholder="50000"
          />
        </div>
      </Field>
    </div>
  );
}
