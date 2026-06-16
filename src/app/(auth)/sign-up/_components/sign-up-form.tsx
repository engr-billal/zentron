"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard } from "../../_components/auth-card";
import { AuthDivider } from "../../_components/auth-divider";
import { EmailPasswordForm } from "../../_components/email-password-form";
import { GoogleAuthButton } from "../../_components/google-auth-button";
import { signUp } from "../../_actions/auth.actions";

export function SignUpForm({
  intendedRole,
}: {
  intendedRole?: "brand" | "creator";
}) {
  const [consent, setConsent] = useState(false);

  return (
    <>
      <AuthCard
        eyebrow="Get early access"
        title={
          <>
            Join the <span className="italic text-brand">trust layer.</span>
          </>
        }
        description="Brands and creators welcome. You pick which side after sign-up."
      >
        {intendedRole ? (
          <p className="mb-2 text-xs text-brand">
            Signing up as a {intendedRole === "brand" ? "brand" : "creator"}.
          </p>
        ) : null}
        <label className="mb-4 flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
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
        <GoogleAuthButton
          label="Sign up with Google"
          disabled={!consent}
          disabledHint="Accept the Terms and Privacy Policy to continue with Google."
        />
        <AuthDivider />
        <EmailPasswordForm
          action={signUp}
          submitLabel="Create account"
          pendingLabel="Creating account..."
          minPassword={8}
          passwordHint="At least 8 characters."
          requireLegalConsent
          intendedRole={intendedRole}
        />
      </AuthCard>
    </>
  );
}
