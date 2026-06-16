import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { redeemBriefShareLink } from "@/app/dashboard/briefs/_actions/share-link.actions";

export const metadata = { title: "Brief invite" };

export default async function InviteRedeemPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-in?next=/invite/${token}`);
  }

  const result = await redeemBriefShareLink(token);
  if ("error" in result) {
    return (
      <section className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col justify-center px-6 py-16">
        <h1 className="font-display text-3xl text-ink">Invite link issue</h1>
        <p className="mt-3 text-sm text-muted-foreground">{result.error}</p>
        <Link
          href="/dashboard"
          className="mt-6 text-sm font-medium text-brand hover:underline"
        >
          Go to dashboard
        </Link>
      </section>
    );
  }

  redirect(`/dashboard/invitations/${result.briefId}`);
}
