"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, selectClass } from "@/components/shared/field";
import { COUNTRIES } from "@/lib/constants/creator";
import {
  updateBrandInvoicing,
  type SettingsActionState,
} from "../_actions/settings.actions";

export function BrandInvoicingForm({
  initialCountry,
}: {
  initialCountry: string;
}) {
  const [state, formAction, pending] = useActionState<
    SettingsActionState,
    FormData
  >(updateBrandInvoicing, null);

  const saved = state && "success" in state;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        label="Invoice country"
        htmlFor="billing_country"
        hint="Used for invoices and tax region. Payouts and escrow rails are not wired yet."
      >
        <select
          id="billing_country"
          name="billing_country"
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
