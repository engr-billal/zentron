import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/marketing/section";
import { ZentronScore } from "@/components/marketing/zentron-score";
import { CTA } from "@/components/marketing/cta";

export const metadata = {
  title: "For creators",
  description:
    "Get matched with brands that fit, sign standardized contracts, and clear milestones.",
};

const benefits = [
  "A score that captures audience, niche, platform, and track record",
  "Brands invite you with a fee already on the table",
  "Standardized contracts — no more 12-page PDFs in your DMs",
  "Submit deliverables, get reviewed, get released",
  "You stay in control of which collabs you accept",
];

export default function ForCreatorsPage() {
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
              For creators
            </p>
            <h1 className="mt-3 font-display text-5xl leading-[1.05] text-balance text-ink sm:text-6xl">
              Get matched. Sign. {" "}
              <span className="italic text-brand">Get paid.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground">
              Zentron replaces the DM-and-Venmo workflow with a real workspace.
              Your score travels with you, briefs come pre-priced, and
              milestone reviews happen on-platform.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-11 px-5">
                <Link href="/sign-up?role=creator">
                  Apply as a creator
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-5">
                <Link href="/pricing">How we earn</Link>
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

      <Section eyebrow={{ number: "01", label: "How it works for creators" }}>
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              n: "01",
              title: "Set your score",
              body: "Add your platforms, base rate, and niches once. We compute your Zentron Score and a fair-rate range.",
            },
            {
              n: "02",
              title: "Pick the briefs you love",
              body: "Brands invite you with the fee already attached. Accept the ones that fit, decline the ones that don't.",
            },
            {
              n: "03",
              title: "Ship and get released",
              body: "Submit the deliverable links, brand approves, milestone is released. Repeat per milestone.",
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

      <ZentronScore />
      <CTA />
    </>
  );
}
