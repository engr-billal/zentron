import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Section } from "./section";

type Plan = {
  number: string;
  kind: string;
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
    number: "01",
    kind: "Commission",
    name: "Pay-per-success",
    price: "8%",
    unit: "per campaign",
    blurb: "Zero upfront fees. Aligned incentives. We only earn when campaigns deliver.",
    bullets: [
      "Free to join — brands & creators",
      "Standardized smart contracts",
      "Milestone escrow included",
      "In-platform disputes",
    ],
    cta: "Get early access",
    href: "/sign-up",
  },
  {
    number: "02",
    kind: "Subscription",
    name: "Scale",
    price: "$499",
    unit: "per month",
    blurb: "For brands running 4+ campaigns monthly. Reduced commission, dedicated success manager.",
    bullets: [
      "3% commission per campaign",
      "Dedicated success manager",
      "Priority creator access",
      "Quarterly performance reviews",
    ],
    cta: "Talk to sales",
    href: "/contact",
    highlight: true,
  },
  {
    number: "03",
    kind: "Value-add",
    name: "Custom services",
    price: "À la carte",
    unit: "one-off",
    blurb: "Strategy, brief writing, performance reports, featured placements — sold individually.",
    bullets: [
      "Brief writing & strategy",
      "Performance deep-dives",
      "Featured marketplace placements",
      "Creator-side coaching",
    ],
    cta: "Browse services",
    href: "/contact",
  },
];

export function Pricing() {
  return (
    <Section
      id="pricing"
      eyebrow={{ number: "06", label: "Business model" }}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <h2 className="font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl">
          Three revenue streams.{" "}
          <span className="italic text-brand">No surprises.</span>
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
          We earn when campaigns deliver, not before. Free to join for both
          sides. 10% off the first collaboration via referral. Zero risk —
          we only get paid on live campaigns.
        </p>
      </div>

      <div className="mt-14 grid gap-4 lg:grid-cols-3">
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
              <p
                className={cn(
                  "text-[11px] uppercase tracking-[0.18em]",
                  plan.highlight ? "text-paper/60" : "text-muted-foreground",
                )}
              >
                {plan.number} · {plan.kind}
              </p>
              <h3
                className={cn(
                  "mt-2 font-display text-2xl",
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

      <div className="mt-10 grid gap-3 rounded-2xl border border-border bg-surface/50 p-6 sm:grid-cols-3">
        {[
          { label: "FREE", value: "for brands & creators" },
          { label: "10% OFF", value: "first collab via referral" },
          { label: "ZERO RISK", value: "we earn only on live campaigns" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-baseline gap-3 text-sm"
          >
            <span className="font-display text-base text-brand">
              ✦ {item.label}
            </span>
            <span className="text-muted-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
