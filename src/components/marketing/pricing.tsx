import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Section } from "./section";

type Plan = {
  name: string;
  price: string;
  unit: string;
  blurb: string;
  bullets: string[];
  cta: string;
  href: string;
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "Pay per campaign",
    price: "8%",
    unit: "commission",
    blurb: "Default plan for most brands. No monthly fee — we earn when a campaign completes.",
    bullets: [
      "Free to create an account",
      "Briefs, matching, and contracts included",
      "Milestone tracking included",
      "Commission on completed campaigns only",
    ],
    cta: "Create brand account",
    href: "/sign-up?role=brand",
  },
  {
    name: "Scale",
    price: "$499",
    unit: "/ month",
    blurb: "For teams running several campaigns a month. Lower commission and hands-on support.",
    bullets: [
      "3% commission per campaign",
      "Dedicated success contact",
      "Priority matching",
      "Quarterly performance review",
    ],
    cta: "Talk to us",
    href: "/contact",
    highlight: true,
  },
  {
    name: "Add-ons",
    price: "Custom",
    unit: "pricing",
    blurb: "Optional services — brief writing, reporting, or featured placement — billed separately.",
    bullets: [
      "Brief and strategy support",
      "Campaign performance reports",
      "Featured creator placement",
      "Creator coaching sessions",
    ],
    cta: "View services",
    href: "/contact",
  },
];

export function Pricing() {
  return (
    <Section id="pricing" eyebrow="Pricing">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <h2 className="font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl">
          Simple plans.{" "}
          <span className="italic text-brand">No setup fee.</span>
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
          Creators join free. Brands join free. During early access you can run
          the full workflow without paying platform fees — paid commission
          tiers activate when we exit beta.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col gap-6 overflow-hidden rounded-2xl p-7 transition-all duration-300",
              plan.highlight
                ? "bg-ink text-paper ring-1 ring-ink"
                : "bg-card text-ink ring-1 ring-border hover:ring-brand/40",
            )}
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-brand"
            />
            <div>
              <h3
                className={cn(
                  "font-display text-2xl",
                  plan.highlight ? "text-paper" : "text-ink",
                )}
              >
                {plan.name}
              </h3>
              <p
                className={cn(
                  "mt-3 text-sm leading-relaxed text-pretty",
                  plan.highlight ? "text-paper/70" : "text-muted-foreground",
                )}
              >
                {plan.blurb}
              </p>
            </div>

            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  "font-display text-5xl leading-none",
                  plan.highlight ? "text-brand" : "text-ink",
                )}
              >
                {plan.price}
              </span>
              <span
                className={cn(
                  "text-xs uppercase tracking-[0.18em]",
                  plan.highlight ? "text-paper/60" : "text-muted-foreground",
                )}
              >
                {plan.unit}
              </span>
            </div>

            <ul className="flex flex-col gap-2">
              {plan.bullets.map((b) => (
                <li
                  key={b}
                  className={cn(
                    "flex items-start gap-2 text-sm",
                    plan.highlight ? "text-paper/80" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full",
                      plan.highlight
                        ? "bg-paper/10 text-brand"
                        : "bg-brand/10 text-brand",
                    )}
                  >
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              variant={plan.highlight ? "brand" : "outline"}
              className="mt-auto h-10 w-full justify-between"
            >
              <Link href={plan.href}>
                {plan.cta}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Questions about pricing?{" "}
        <Link href="/faq" className="font-medium text-ink hover:text-brand">
          Read the FAQ
        </Link>{" "}
        or{" "}
        <Link href="/contact" className="font-medium text-ink hover:text-brand">
          contact us
        </Link>
        .
      </p>
    </Section>
  );
}
