"use client";

import { Field, selectClass } from "@/components/shared/field";
import { COUNTRIES, CURRENCIES } from "@/lib/constants/creator";
import type { BrandBillingInput } from "@/lib/validations/brand";

type Props = {
  value: BrandBillingInput;
  errors: Partial<Record<keyof BrandBillingInput, string>>;
  onChange: (next: BrandBillingInput) => void;
};

export function StepBilling({ value, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Invoice country"
        htmlFor="billing_country"
        hint="Used for invoices and tax region. You can change this anytime in settings."
        error={errors.billing_country}
      >
        <select
          id="billing_country"
          name="billing_country"
          value={value.billing_country}
          onChange={(e) =>
            onChange({ ...value, billing_country: e.target.value })
          }
          className={selectClass}
          required
        >
          <option value="" disabled>
            Pick a country
          </option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Default currency"
        htmlFor="currency"
        error={errors.currency}
      >
        <select
          id="currency"
          name="currency"
          value={value.currency}
          onChange={(e) =>
            onChange({
              ...value,
              currency: e.target.value as BrandBillingInput["currency"],
            })
          }
          className={selectClass}
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}
