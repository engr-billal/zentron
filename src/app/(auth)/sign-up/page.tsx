import Link from "next/link";
import { SignUpForm } from "./_components/sign-up-form";

export const metadata = { title: "Get early access" };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role =
    params.role === "brand" || params.role === "creator"
      ? params.role
      : undefined;

  return (
    <>
      <SignUpForm intendedRole={role} />
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
