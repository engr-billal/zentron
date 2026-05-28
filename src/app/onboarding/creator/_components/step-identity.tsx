"use client";

import { Input } from "@/components/ui/input";
import { COUNTRIES, LANGUAGES } from "@/lib/constants/creator";
import { Field, selectClass, textareaClass } from "@/components/shared/field";
import type { CreatorIdentityInput } from "@/lib/validations/creator";

type Props = {
  value: CreatorIdentityInput;
  errors: Partial<Record<keyof CreatorIdentityInput, string>>;
  onChange: (next: CreatorIdentityInput) => void;
};

export function StepIdentity({ value, errors, onChange }: Props) {
  const toggleLanguage = (code: string) => {
    const exists = value.languages.includes(code);
    const next = exists
      ? value.languages.filter((c) => c !== code)
      : [...value.languages, code].slice(0, 5);
    onChange({ ...value, languages: next });
  };

  return (
    <div className="flex flex-col gap-5">
      <Field
        label="Handle"
        htmlFor="handle"
        hint="Your Zentron handle, lowercase letters/numbers/underscores, 3-30 chars."
        error={errors.handle}
      >
        <Input
          id="handle"
          name="handle"
          autoComplete="username"
          value={value.handle}
          onChange={(e) =>
            onChange({ ...value, handle: e.target.value.toLowerCase() })
          }
          placeholder="kira_studio"
          required
        />
      </Field>

      <Field
        label="Country"
        htmlFor="country"
        error={errors.country}
      >
        <select
          id="country"
          name="country"
          value={value.country}
          onChange={(e) => onChange({ ...value, country: e.target.value })}
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
        label="Languages"
        htmlFor="languages"
        hint="Pick at least one; up to five."
        error={errors.languages}
      >
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => {
            const active = value.languages.includes(lang.code);
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => toggleLanguage(lang.code)}
                className={
                  active
                    ? "rounded-full bg-ink px-3 py-1 text-xs font-medium text-paper"
                    : "rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:border-brand/40"
                }
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </Field>

      <Field
        label="Bio"
        htmlFor="bio"
        hint="One or two sentences. Optional but brands love context."
        error={errors.bio}
      >
        <textarea
          id="bio"
          name="bio"
          value={value.bio ?? ""}
          onChange={(e) => onChange({ ...value, bio: e.target.value })}
          maxLength={500}
          className={textareaClass}
          placeholder="Long-form creator covering UK personal finance and side hustles."
        />
      </Field>
    </div>
  );
}
