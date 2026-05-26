import Link from "next/link";
import { AuthCard } from "../_components/auth-card";
import { EmailPasswordForm } from "../_components/email-password-form";
import { signIn } from "../_actions/auth.actions";

export const metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <>
      <AuthCard
        eyebrow="Sign in"
        title={
          <>
            Welcome <span className="italic text-brand">back.</span>
          </>
        }
        description="Pick up where you left off — briefs, scores, campaigns."
      >
        <EmailPasswordForm
          action={signIn}
          submitLabel="Sign in"
          pendingLabel="Signing in..."
        />
      </AuthCard>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-ink underline-offset-4 hover:text-brand hover:underline"
        >
          Get early access
        </Link>
      </p>
    </>
  );
}
