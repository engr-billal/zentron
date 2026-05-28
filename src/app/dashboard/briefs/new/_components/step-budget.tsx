"use client";

import { Input } from "@/components/ui/input";
import { Field, selectClass } from "@/components/shared/field";
import { CURRENCIES } from "@/lib/constants/creator";
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
          label="Min budget (cents)"
          htmlFor="budget_min_cents"
          hint="E.g. 50000 = $500.00"
          error={errors.budget_min_cents}
        >
          <Input
            id="budget_min_cents"
            type="number"
            min={0}
            value={value.budget_min_cents ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                budget_min_cents: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            placeholder="50000"
          />
        </Field>
        <Field
          label="Max budget (cents)"
          htmlFor="budget_max_cents"
          error={errors.budget_max_cents}
        >
          <Input
            id="budget_max_cents"
            type="number"
            min={0}
            value={value.budget_max_cents ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                budget_max_cents: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            placeholder="200000"
          />
        </Field>
      </div>
    </div>
  );
}
