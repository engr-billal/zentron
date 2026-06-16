"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/shared/field";
import {
  changePassword,
  type SettingsActionState,
} from "../_actions/password.actions";

export function PasswordChangeForm() {
  const [state, formAction, pending] = useActionState<
    SettingsActionState,
    FormData
  >(changePassword, null);

  const saved = state && "success" in state;

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-4 border-t border-border pt-4">
      <Field label="New password" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>
      <Field label="Confirm password" htmlFor="password_confirm">
        <Input
          id="password_confirm"
          name="password_confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
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
          {pending ? "Updating..." : "Update password"}
        </Button>
        {saved ? <span className="text-xs text-brand">Password updated.</span> : null}
      </div>
    </form>
  );
}
