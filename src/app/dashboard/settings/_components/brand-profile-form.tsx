"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/shared/field";
import {
  updateBrandProfile,
  type SettingsActionState,
} from "../_actions/settings.actions";

export function BrandProfileForm({
  initialCompanyName,
  initialWebsite,
  initialIndustry,
  initialLogoUrl,
}: {
  initialCompanyName: string;
  initialWebsite: string;
  initialIndustry: string;
  initialLogoUrl: string;
}) {
  const [state, formAction, pending] = useActionState<
    SettingsActionState,
    FormData
  >(updateBrandProfile, null);

  const saved = state && "success" in state;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Company name" htmlFor="company_name">
        <Input
          id="company_name"
          name="company_name"
          defaultValue={initialCompanyName}
          maxLength={120}
          required
        />
      </Field>
      <Field label="Website" htmlFor="website" hint="Optional — include https://">
        <Input
          id="website"
          name="website"
          type="url"
          defaultValue={initialWebsite}
          placeholder="https://yourbrand.com"
        />
      </Field>
      <Field label="Industry" htmlFor="industry">
        <Input
          id="industry"
          name="industry"
          defaultValue={initialIndustry}
          maxLength={80}
          placeholder="e.g. Beauty, Fintech"
        />
      </Field>
      <Field label="Logo URL" htmlFor="logo_url" hint="Optional — direct link to a square logo image.">
        <Input
          id="logo_url"
          name="logo_url"
          type="url"
          defaultValue={initialLogoUrl}
          placeholder="https://..."
        />
      </Field>

      {state && "error" in state && state.error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="brand" size="sm" disabled={pending}>
          {pending ? "Saving..." : "Save company profile"}
        </Button>
        {saved ? <span className="text-xs text-brand">Saved.</span> : null}
      </div>
    </form>
  );
}
