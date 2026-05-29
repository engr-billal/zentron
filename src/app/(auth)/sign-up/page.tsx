import Link from "next/link";
import { AuthCard } from "../_components/auth-card";
import { AuthDivider } from "../_components/auth-divider";
import { EmailPasswordForm } from "../_components/email-password-form";
import { GoogleAuthButton } from "../_components/google-auth-button";
import { signUp } from "../_actions/auth.actions";

export const metadata = { title: "Get early access" };

export default function SignUpPage() {
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
        <GoogleAuthButton label="Sign up with Google" />
        <AuthDivider />
        <EmailPasswordForm
          action={signUp}
          submitLabel="Create account"
          pendingLabel="Creating account..."
          minPassword={8}
          passwordHint="At least 8 characters."
        />
      </AuthCard>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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
