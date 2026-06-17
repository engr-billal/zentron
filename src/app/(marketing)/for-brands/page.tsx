import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/marketing/section";
import { Escrow } from "@/components/marketing/escrow";
import { CTA } from "@/components/marketing/cta";

export const metadata = {
  title: "For brands",
  description:
    "Find vetted creators, lock fees per milestone, and pay only when work ships.",
};

const benefits = [
  "Match with vetted creators in days, not weeks",
  "Standardized contracts — no more email PDFs",
  "Fees tied to milestones you actually approve",
  "Audit trail on every brief, contract, and payout",
  "Clear pricing — 8% commission, no upfront fees",
];

export default function ForBrandsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-paper px-6 pt-32 pb-12 sm:px-10 lg:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 text-ink/[0.06] bg-grain"
        />
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
              For brands
            </p>
            <h1 className="mt-3 font-display text-5xl leading-[1.05] text-balance text-ink sm:text-6xl">
              Brief, sign, ship —{" "}
              <span className="italic text-brand">all in one place.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground">
              Stop chasing rates over DMs and stitching contracts together
              from PDFs. Zentron gives marketing teams a workspace where every
              brief, invitation, and milestone lives in one timeline.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-11 px-5">
                <Link href="/sign-up?role=brand">
                  Start your first brief
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-5">
                <Link href="/pricing">See pricing</Link>
              </Button>
            </div>
          </div>

          <ul className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
            {benefits.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 text-sm leading-relaxed text-ink/90"
              >
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section eyebrow="How it works for brands">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              n: "01",
              title: "Write the brief",
              body: "5-step wizard captures the audience, deliverables, budget, and exclusivity terms in minutes.",
            },
            {
              n: "02",
              title: "Match and invite",
              body: "Top creators surface ranked by your brief — review the score breakdown and send invitations.",
            },
            {
              n: "03",
              title: "Pay per milestone",
              body: "Approve deliverables as they land. Money clears against milestones, not upfront promises.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
            >
              <span aria-hidden className="absolute inset-x-6 top-0 h-px bg-brand" />
              <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
                {step.n}
              </p>
              <h3 className="mt-2 font-display text-2xl text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Escrow />
      <CTA />
    </>
  );
}
