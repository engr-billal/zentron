import Link from "next/link";
import { redirect } from "next/navigation";
import { Wordmark } from "@/components/marketing/wordmark";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/permissions";
import { DashboardNav } from "./_components/dashboard-nav";
import { NotificationBell } from "./_components/notification-bell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role ?? null) as UserRole | null;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-border/70 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6 sm:px-10">
          <Link href="/dashboard" aria-label="Dashboard">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <form action="/api/auth/sign-out" method="post">
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
          </div>
        </div>
        {role ? (
          <div className="mx-auto w-full max-w-7xl px-6 pb-3 sm:px-10">
            <DashboardNav role={role} />
          </div>
        ) : null}
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
