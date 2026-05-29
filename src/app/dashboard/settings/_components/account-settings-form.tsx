"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, selectClass } from "@/components/shared/field";
import { COUNTRIES } from "@/lib/constants/creator";
import {
  updateAccountSettings,
  type SettingsActionState,
} from "../_actions/settings.actions";

export function AccountSettingsForm({
  initialDisplayName,
  initialCountry,
}: {
  initialDisplayName: string;
  initialCountry: string;
}) {
  const [state, formAction, pending] = useActionState<
    SettingsActionState,
    FormData
  >(updateAccountSettings, null);

  const saved = state && "success" in state;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Display name" htmlFor="display_name">
        <Input
          id="display_name"
          name="display_name"
          defaultValue={initialDisplayName}
          maxLength={100}
          required
        />
      </Field>

      <Field label="Country" htmlFor="country">
        <select
          id="country"
          name="country"
          defaultValue={initialCountry || "GB"}
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
          {pending ? "Saving..." : "Save changes"}
        </Button>
        {saved ? <span className="text-xs text-brand">Saved.</span> : null}
      </div>
    </form>
  );
}
