"use client";

import { Input } from "@/components/ui/input";
import { Field, selectClass, textareaClass } from "@/components/shared/field";
import { NICHES, NICHE_LABELS } from "@/lib/constants/creator";
import type { BriefBasicsInput } from "@/lib/validations/brief";

type Props = {
  value: BriefBasicsInput;
  errors: Partial<Record<keyof BriefBasicsInput, string>>;
  onChange: (next: BriefBasicsInput) => void;
};

export function StepBasics({ value, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Brief title"
        htmlFor="title"
        hint="Short, clear. Creators see this first."
        error={errors.title}
      >
        <Input
          id="title"
          name="title"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Q1 launch — UK finance creators"
          required
        />
      </Field>

      <Field
        label="Objective (optional)"
        htmlFor="objective"
        hint="What is success for this campaign? E.g. app installs, conversions, awareness."
        error={errors.objective}
      >
        <textarea
          id="objective"
          name="objective"
          value={value.objective ?? ""}
          onChange={(e) => onChange({ ...value, objective: e.target.value })}
          maxLength={2000}
          className={textareaClass}
          placeholder="Drive 10K sign-ups for our new finance product among UK 25–34 millennials."
        />
      </Field>

      <Field
        label="Primary niche"
        htmlFor="niche"
        hint="Drives the matching multiplier. Pick the closest fit."
        error={errors.niche}
      >
        <select
          id="niche"
          name="niche"
          value={value.niche}
          onChange={(e) =>
            onChange({ ...value, niche: e.target.value as BriefBasicsInput["niche"] })
          }
          className={selectClass}
          required
        >
          <option value="" disabled>
            Pick a niche
          </option>
          {NICHES.map((n) => (
            <option key={n} value={n}>
              {NICHE_LABELS[n]}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}
