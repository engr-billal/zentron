import Link from "next/link";
import { Wordmark } from "./wordmark";

const sections = [
  {
    label: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how" },
      { label: "For brands", href: "/for-brands" },
      { label: "For creators", href: "/for-creators" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Cookies", href: "/legal/cookies" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-paper">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.4fr_2fr] lg:gap-20">
        <div>
          <Wordmark size="lg" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            The workspace for brand–creator campaigns. Write briefs, match
            creators, sign contracts, and track milestones in one place.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/sign-up"
              className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brand/40"
            >
              Create account
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-ink"
            >
              Sign in
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground/80">
            Zentron Solutions Ltd · United Kingdom
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {section.label}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink/80 transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-10">
          <p>© {new Date().getFullYear()} Zentron Solutions. All rights reserved.</p>
          <p className="text-muted-foreground/80">
            Early access — milestone tracking live; payment rails on the way.
          </p>
        </div>
      </div>
    </footer>
  );
}
