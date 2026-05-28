"use client";

import { Input } from "@/components/ui/input";
import { Field, selectClass } from "@/components/shared/field";
import { CURRENCIES } from "@/lib/constants/creator";
import type { ContractScheduleInput } from "@/lib/validations/contract";

type Props = {
  value: ContractScheduleInput;
  errors: Partial<Record<keyof ContractScheduleInput, string>>;
  onChange: (next: ContractScheduleInput) => void;
};

export function StepSchedule({ value, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Total fee (cents)"
        htmlFor="total_fee_cents"
        hint="Inclusive of all milestones. E.g. 250000 = $2,500.00"
        error={errors.total_fee_cents}
      >
        <div className="flex gap-2">
          <select
            value={value.currency}
            onChange={(e) =>
              onChange({
                ...value,
                currency: e.target.value as ContractScheduleInput["currency"],
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
            id="total_fee_cents"
            type="number"
            min={0}
            value={value.total_fee_cents}
            onChange={(e) =>
              onChange({
                ...value,
                total_fee_cents: Number(e.target.value) || 0,
              })
            }
            required
          />
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Start date (optional)"
          htmlFor="start_date"
          error={errors.start_date}
        >
          <Input
            id="start_date"
            type="date"
            value={value.start_date ?? ""}
            onChange={(e) =>
              onChange({ ...value, start_date: e.target.value })
            }
          />
        </Field>
        <Field
          label="End date (optional)"
          htmlFor="end_date"
          error={errors.end_date}
        >
          <Input
            id="end_date"
            type="date"
            value={value.end_date ?? ""}
            onChange={(e) => onChange({ ...value, end_date: e.target.value })}
          />
        </Field>
      </div>
    </div>
  );
}
