"use client";

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
};

export function EmailPasswordForm({
  action,
  submitLabel,
  pendingLabel,
  minPassword,
  passwordHint,
}: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
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
