import Link from "next/link";
import { Wordmark } from "@/components/marketing/wordmark";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-border/70 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6 sm:px-10">
          <Link href="/dashboard" aria-label="Dashboard">
            <Wordmark />
          </Link>
          <form action="/api/auth/sign-out" method="post">
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
