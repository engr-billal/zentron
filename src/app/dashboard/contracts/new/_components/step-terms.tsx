"use client";

import { Field, textareaClass } from "@/components/shared/field";
import type { ContractTermsInput } from "@/lib/validations/contract";

type Props = {
  value: ContractTermsInput;
  errors: Partial<Record<keyof ContractTermsInput, string>>;
  onChange: (next: ContractTermsInput) => void;
};

export function StepTerms({ value, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Exclusivity (optional)"
        htmlFor="exclusivity"
        hint="Any category exclusivity restrictions for the duration of the campaign."
        error={errors.exclusivity}
      >
        <textarea
          id="exclusivity"
          value={value.exclusivity ?? ""}
          onChange={(e) =>
            onChange({ ...value, exclusivity: e.target.value })
          }
          maxLength={1000}
          className={textareaClass}
          rows={3}
        />
      </Field>

      <Field
        label="Usage rights (optional)"
        htmlFor="usage_rights"
        hint="What the brand can do with the content beyond the creator's channels."
        error={errors.usage_rights}
      >
        <textarea
          id="usage_rights"
          value={value.usage_rights ?? ""}
          onChange={(e) =>
            onChange({ ...value, usage_rights: e.target.value })
          }
          maxLength={1000}
          className={textareaClass}
          rows={3}
        />
      </Field>
    </div>
  );
}
