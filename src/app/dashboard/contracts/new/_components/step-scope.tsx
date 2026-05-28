"use client";

import { Input } from "@/components/ui/input";
import { Field, textareaClass } from "@/components/shared/field";
import type { ContractScopeInput } from "@/lib/validations/contract";

type Props = {
  value: ContractScopeInput;
  errors: Partial<Record<keyof ContractScopeInput, string>>;
  onChange: (next: ContractScopeInput) => void;
};

export function StepScope({ value, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Contract title"
        htmlFor="title"
        hint="Visible to the creator. Defaults to the brief title."
        error={errors.title}
      >
        <Input
          id="title"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          required
        />
      </Field>

      <Field
        label="Scope of work"
        htmlFor="scope"
        hint="What is the creator agreeing to produce? Includes deliverable list + any specs."
        error={errors.scope}
      >
        <textarea
          id="scope"
          value={value.scope}
          onChange={(e) => onChange({ ...value, scope: e.target.value })}
          maxLength={5000}
          className={textareaClass}
          rows={8}
          required
        />
      </Field>
    </div>
  );
}
