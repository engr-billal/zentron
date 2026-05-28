import Link from "next/link";
import { Wordmark } from "@/components/marketing/wordmark";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-screen flex-col bg-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 text-ink/[0.04] bg-grain"
      />
      <header className="px-6 py-6 sm:px-10">
        <Link href="/" aria-label="Zentron Solutions home">
          <Wordmark />
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-6 pb-16 sm:px-10">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
