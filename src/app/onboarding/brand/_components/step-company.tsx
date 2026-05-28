"use client";

import { Input } from "@/components/ui/input";
import { Field, selectClass } from "@/components/shared/field";
import {
  INDUSTRIES,
  TEAM_SIZES,
  TEAM_SIZE_LABELS,
} from "@/lib/constants/brand";
import type { BrandCompanyInput } from "@/lib/validations/brand";

type Props = {
  value: BrandCompanyInput;
  errors: Partial<Record<keyof BrandCompanyInput, string>>;
  onChange: (next: BrandCompanyInput) => void;
};

export function StepCompany({ value, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Company name"
        htmlFor="company_name"
        error={errors.company_name}
      >
        <Input
          id="company_name"
          name="company_name"
          value={value.company_name}
          onChange={(e) =>
            onChange({ ...value, company_name: e.target.value })
          }
          placeholder="Acme D2C"
          required
        />
      </Field>

      <Field label="Website (optional)" htmlFor="website" error={errors.website}>
        <Input
          id="website"
          name="website"
          type="url"
          value={value.website ?? ""}
          onChange={(e) => onChange({ ...value, website: e.target.value })}
          placeholder="https://acme.com"
        />
      </Field>

      <Field label="Industry" htmlFor="industry" error={errors.industry}>
        <select
          id="industry"
          name="industry"
          value={value.industry}
          onChange={(e) =>
            onChange({
              ...value,
              industry: e.target.value as BrandCompanyInput["industry"],
            })
          }
          className={selectClass}
          required
        >
          <option value="" disabled>
            Pick an industry
          </option>
          {INDUSTRIES.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Team size" htmlFor="team_size" error={errors.team_size}>
        <select
          id="team_size"
          name="team_size"
          value={value.team_size}
          onChange={(e) =>
            onChange({
              ...value,
              team_size: e.target.value as BrandCompanyInput["team_size"],
            })
          }
          className={selectClass}
          required
        >
          {TEAM_SIZES.map((t) => (
            <option key={t} value={t}>
              {TEAM_SIZE_LABELS[t]}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}
