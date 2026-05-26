import Link from "next/link";
import { Mail } from "lucide-react";
import { AuthCard } from "../_components/auth-card";

export const metadata = { title: "Verify your email" };

export default function VerifyEmailPage() {
  return (
    <>
      <AuthCard
        eyebrow="Almost there"
        title={
          <>
            Check your <span className="italic text-brand">inbox.</span>
          </>
        }
        description="We sent you a link to confirm your email. Click it and we'll pick you up on the other side."
      >
        <div className="flex items-start gap-3 rounded-xl border border-border bg-surface/50 p-4 text-sm text-muted-foreground">
          <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
          <p>
            Didn&apos;t get the email? Check your spam folder, or wait a minute
            and try signing in.
          </p>
        </div>
      </AuthCard>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Wrong email?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-ink underline-offset-4 hover:text-brand hover:underline"
        >
          Start over
        </Link>
      </p>
    </>
  );
}
