"use client";

import { Field, textareaClass } from "@/components/shared/field";
import type { BriefTermsInput } from "@/lib/validations/brief";

type Props = {
  value: BriefTermsInput;
  errors: Partial<Record<keyof BriefTermsInput, string>>;
  onChange: (next: BriefTermsInput) => void;
};

export function StepTerms({ value, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Exclusivity (optional)"
        htmlFor="exclusivity"
        hint="Any category exclusivity for the duration of the campaign? E.g. no competing fintech."
        error={errors.exclusivity}
      >
        <textarea
          id="exclusivity"
          value={value.exclusivity ?? ""}
          onChange={(e) =>
            onChange({ ...value, exclusivity: e.target.value })
          }
          maxLength={500}
          className={textareaClass}
          placeholder="No competing fintech brands for 30 days after publishing."
        />
      </Field>

      <Field
        label="Usage rights (optional)"
        htmlFor="usage_rights"
        hint="What can you do with the content beyond the creator's channels? Whitelisting, paid ads, repurposing."
        error={errors.usage_rights}
      >
        <textarea
          id="usage_rights"
          value={value.usage_rights ?? ""}
          onChange={(e) =>
            onChange({ ...value, usage_rights: e.target.value })
          }
          maxLength={500}
          className={textareaClass}
          placeholder="90 days organic + 30 days paid amplification on brand channels."
        />
      </Field>
    </div>
  );
}
