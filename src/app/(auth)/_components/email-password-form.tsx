"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ActionState } from "../_actions/auth.actions";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  pendingLabel: string;
  minPassword?: number;
  passwordHint?: string;
  requireLegalConsent?: boolean;
  intendedRole?: "brand" | "creator";
};

export function EmailPasswordForm({
  action,
  submitLabel,
  pendingLabel,
  minPassword,
  passwordHint,
  requireLegalConsent,
  intendedRole,
}: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {intendedRole ? (
        <input type="hidden" name="intended_role" value={intendedRole} />
      ) : null}
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={minPassword ? "new-password" : "current-password"}
          minLength={minPassword}
          required
        />
        {passwordHint ? (
          <p className="text-xs text-muted-foreground">{passwordHint}</p>
        ) : null}
      </div>
      {requireLegalConsent ? (
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="accepted_terms"
            value="on"
            required
            className="mt-1 size-4 rounded border-border accent-brand"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/legal/terms"
              className="font-medium text-ink underline-offset-4 hover:text-brand hover:underline"
              target="_blank"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/legal/privacy"
              className="font-medium text-ink underline-offset-4 hover:text-brand hover:underline"
              target="_blank"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
      ) : null}
      {state?.error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}
      <Button
        type="submit"
        variant="brand"
        size="lg"
        className="mt-2"
        disabled={pending}
      >
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
