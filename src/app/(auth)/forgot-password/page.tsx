"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "../_components/auth-card";
import {
  requestPasswordReset,
  type ForgotPasswordState,
} from "../_actions/auth.actions";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState<
    ForgotPasswordState,
    FormData
  >(requestPasswordReset, null);

  const sent = state && "success" in state;

  return (
    <>
      <AuthCard
        eyebrow="Reset password"
        title={
          <>
            Forgot your <span className="italic text-brand">password?</span>
          </>
        }
        description="Drop your email and we'll send you a reset link."
      >
        {sent ? (
          <div
            role="status"
            className="rounded-md border border-brand/30 bg-brand/10 px-3 py-3 text-sm text-brand"
          >
            Check your inbox. The link signs you in and lets you set a new
            password.
          </div>
        ) : (
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
            {state && "error" in state && state.error ? (
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
              {pending ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        )}
      </AuthCard>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-ink underline-offset-4 hover:text-brand hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
