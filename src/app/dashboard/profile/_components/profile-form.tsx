"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  selectClass,
  textareaClass,
} from "@/app/onboarding/creator/_components/form-field";
import {
  CREATOR_PLATFORM_TYPES,
  COUNTRIES,
  CURRENCIES,
  LANGUAGES,
  NICHES,
  NICHE_LABELS,
  PLATFORM_LABELS,
} from "@/lib/constants/creator";
import type { Niche } from "@/lib/scoring/types";
import {
  updateCreatorProfile,
  type ProfileActionState,
} from "../_actions/profile.actions";

type Props = {
  initial: {
    handle: string;
    country: string;
    languages: string[];
    bio: string;
    niches: string[];
    primary_platform: (typeof CREATOR_PLATFORM_TYPES)[number];
    base_rate_cents: number | null;
    currency: (typeof CURRENCIES)[number];
  };
};

export function ProfileForm({ initial }: Props) {
  const [state, formAction, pending] = useActionState<ProfileActionState, FormData>(
    updateCreatorProfile,
    null,
  );
  const [languages, setLanguages] = useState<string[]>(initial.languages);
  const [niches, setNiches] = useState<string[]>(initial.niches);

  const toggleLanguage = (code: string) => {
    setLanguages((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code].slice(0, 5),
    );
  };

  const toggleNiche = (n: string) => {
    setNiches((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n].slice(0, 3),
    );
  };

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {languages.map((l) => (
        <input key={l} type="hidden" name="languages" value={l} />
      ))}
      {niches.map((n) => (
        <input key={n} type="hidden" name="niches" value={n} />
      ))}

      <Field label="Handle" htmlFor="handle">
        <Input
          id="handle"
          name="handle"
          defaultValue={initial.handle}
          required
        />
      </Field>

      <Field label="Country" htmlFor="country">
        <select
          id="country"
          name="country"
          defaultValue={initial.country}
          className={selectClass}
          required
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Languages" htmlFor="languages">
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => {
            const active = languages.includes(lang.code);
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

      <Field label="Bio" htmlFor="bio">
        <textarea
          id="bio"
          name="bio"
          defaultValue={initial.bio}
          maxLength={500}
          className={textareaClass}
        />
      </Field>

      <Field label="Niches" htmlFor="niches" hint="Pick 1–3.">
        <div className="flex flex-wrap gap-2">
          {NICHES.map((n) => {
            const active = niches.includes(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => toggleNiche(n)}
                className={
                  active
                    ? "rounded-full bg-brand px-3 py-1 text-xs font-medium text-brand-foreground"
                    : "rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:border-brand/40"
                }
              >
                {NICHE_LABELS[n as Niche]}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Primary platform" htmlFor="primary_platform">
        <select
          id="primary_platform"
          name="primary_platform"
          defaultValue={initial.primary_platform}
          className={selectClass}
          required
        >
          {CREATOR_PLATFORM_TYPES.map((p) => (
            <option key={p} value={p}>
              {PLATFORM_LABELS[p]}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Base rate (cents)" htmlFor="base_rate_cents">
        <div className="flex gap-2">
          <select
            name="currency"
            defaultValue={initial.currency}
            className={`${selectClass} w-24`}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Input
            id="base_rate_cents"
            name="base_rate_cents"
            type="number"
            min={0}
            defaultValue={initial.base_rate_cents ?? ""}
          />
        </div>
      </Field>

      {state && "error" in state ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      <div className="mt-2 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard">Cancel</Link>
        </Button>
        <Button type="submit" variant="brand" size="lg" disabled={pending}>
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
