"use client";

import { Input } from "@/components/ui/input";
import { Field, selectClass } from "@/components/shared/field";
import { CURRENCIES } from "@/lib/constants/creator";
import { centsToMajor, majorToCents } from "@/lib/money";
import type { BriefBudgetInput } from "@/lib/validations/brief";

type Props = {
  value: BriefBudgetInput;
  errors: Partial<Record<keyof BriefBudgetInput, string>>;
  onChange: (next: BriefBudgetInput) => void;
};

export function StepBudget({ value, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Currency"
        htmlFor="currency"
        error={errors.currency}
      >
        <select
          id="currency"
          value={value.currency}
          onChange={(e) =>
            onChange({
              ...value,
              currency: e.target.value as BriefBudgetInput["currency"],
            })
          }
          className={`${selectClass} max-w-32`}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={`Min budget (${value.currency})`}
          htmlFor="budget_min"
          hint="Enter the amount in your currency, e.g. 500 for $500."
          error={errors.budget_min_cents}
        >
          <Input
            id="budget_min"
            type="number"
            min={0}
            step="0.01"
            value={centsToMajor(value.budget_min_cents)}
            onChange={(e) =>
              onChange({
                ...value,
                budget_min_cents: majorToCents(e.target.value),
              })
            }
            placeholder="500"
          />
        </Field>
        <Field
          label={`Max budget (${value.currency})`}
          htmlFor="budget_max"
          error={errors.budget_max_cents}
        >
          <Input
            id="budget_max"
            type="number"
            min={0}
            step="0.01"
            value={centsToMajor(value.budget_max_cents)}
            onChange={(e) =>
              onChange({
                ...value,
                budget_max_cents: majorToCents(e.target.value),
              })
            }
            placeholder="2000"
          />
        </Field>
      </div>
    </div>
  );
}
