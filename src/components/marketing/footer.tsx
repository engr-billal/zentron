import Link from "next/link";
import { Wordmark } from "./wordmark";

const sections = [
  {
    label: "Product",
    links: [
      { label: "How it works", href: "#how" },
      { label: "Zentron Score", href: "#score" },
      { label: "Escrow", href: "#escrow" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "Vision", href: "#vision" },
      { label: "Pitch deck", href: "#" },
      { label: "Contact", href: "mailto:usman@zentronsolutions.com" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
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
            The trust layer between brands and creators. Algorithmic matching,
            smart contracts, milestone escrow.
          </p>
          <p className="mt-6 text-xs text-muted-foreground/80">
            Zentron Solutions Ltd · Registered in the United Kingdom
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
          <p>
            Built for both sides of the handshake.{" "}
            <span className="text-brand">●</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
