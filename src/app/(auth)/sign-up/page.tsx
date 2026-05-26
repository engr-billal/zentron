import Link from "next/link";
import { AuthCard } from "../_components/auth-card";
import { EmailPasswordForm } from "../_components/email-password-form";
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
