"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "../_components/auth-card";
import {
  resetPassword,
  type ActionState,
} from "../_actions/auth.actions";

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    resetPassword,
    null,
  );

  return (
    <AuthCard
      eyebrow="New password"
      title={
        <>
          Pick a new <span className="italic text-brand">password.</span>
        </>
      }
      description="Make it at least 8 characters. We'll sign you in once it's set."
    >
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <p className="text-xs text-muted-foreground">
            At least 8 characters.
          </p>
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
          {pending ? "Saving..." : "Set new password"}
        </Button>
      </form>
    </AuthCard>
  );
}
