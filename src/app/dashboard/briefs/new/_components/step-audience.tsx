"use client";

import { Input } from "@/components/ui/input";
import { Field } from "@/components/shared/field";
import {
  AUDIENCE_BAND_LABELS,
  AUDIENCE_SIZE_BANDS,
} from "@/lib/constants/brand";
import { COUNTRIES } from "@/lib/constants/creator";
import type { BriefAudienceInput } from "@/lib/validations/brief";

type Props = {
  value: BriefAudienceInput;
  errors: Partial<Record<keyof BriefAudienceInput, string>>;
  onChange: (next: BriefAudienceInput) => void;
};

const ACTIVE_CHIP =
  "rounded-full bg-brand px-3 py-1 text-xs font-medium text-brand-foreground";
const INACTIVE_CHIP =
  "rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:border-brand/40";

export function StepAudience({ value, errors, onChange }: Props) {
  const toggleCountry = (code: string) => {
    const next = value.countries.includes(code)
      ? value.countries.filter((c) => c !== code)
      : [...value.countries, code];
    onChange({ ...value, countries: next });
  };
  const toggleBand = (band: (typeof AUDIENCE_SIZE_BANDS)[number]) => {
    const next = value.audience_size_bands.includes(band)
      ? value.audience_size_bands.filter((b) => b !== band)
      : [...value.audience_size_bands, band];
    onChange({ ...value, audience_size_bands: next });
  };

  return (
    <div className="flex flex-col gap-6">
      <Field
        label="Target countries"
        htmlFor="countries"
        hint="Where your buyers live. Leave empty for global."
        error={errors.countries}
      >
        <div className="flex flex-wrap gap-2">
          {COUNTRIES.map((c) => {
            const active = value.countries.includes(c.code);
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => toggleCountry(c.code)}
                className={active ? ACTIVE_CHIP : INACTIVE_CHIP}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Age min (optional)" htmlFor="age_min" error={errors.age_min}>
          <Input
            id="age_min"
            type="number"
            min={13}
            max={99}
            value={value.age_min ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                age_min: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="18"
          />
        </Field>
        <Field label="Age max (optional)" htmlFor="age_max" error={errors.age_max}>
          <Input
            id="age_max"
            type="number"
            min={13}
            max={99}
            value={value.age_max ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                age_max: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="34"
          />
        </Field>
      </div>

      <Field
        label="Creator audience size"
        htmlFor="audience_size_bands"
        hint="Which creator sizes do you want to consider? Leave empty for any."
        error={errors.audience_size_bands}
      >
        <div className="flex flex-wrap gap-2">
          {AUDIENCE_SIZE_BANDS.map((band) => {
            const active = value.audience_size_bands.includes(band);
            return (
              <button
                key={band}
                type="button"
                onClick={() => toggleBand(band)}
                className={active ? ACTIVE_CHIP : INACTIVE_CHIP}
              >
                {AUDIENCE_BAND_LABELS[band]}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}
