import { Section } from "@/components/marketing/section";
import { CTA } from "@/components/marketing/cta";

export const metadata = {
  title: "About",
  description:
    "Why Zentron exists, who we're building it for, and how we got here.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-paper px-6 pt-32 pb-12 sm:px-10 lg:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 text-ink/[0.06] bg-grain"
        />
        <div className="mx-auto w-full max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
            About
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[1.1] text-balance text-ink sm:text-6xl">
            Built for both sides of {" "}
            <span className="italic text-brand">the handshake.</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Zentron Solutions is a UK Limited company building the trust layer
            for creator marketing. We started this after watching brands lose
            money to ghost deliveries and creators chase invoices for months.
            Both sides need the same thing: standardized contracts, fair
            pricing signals, and milestone-based payouts.
          </p>
        </div>
      </section>

      <Section eyebrow={{ number: "01", label: "Principles" }}>
        <div className="grid gap-6 lg:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
            >
              <span aria-hidden className="absolute inset-x-6 top-0 h-px bg-brand" />
              <h2 className="font-display text-2xl text-ink">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <CTA />
    </>
  );
}

const PRINCIPLES = [
  {
    title: "Both sides matter.",
    body: "We refuse to optimize for one side at the expense of the other. Every feature has to work for both brands and creators or it doesn't ship.",
  },
  {
    title: "Standards over surfaces.",
    body: "Contracts, briefs, and milestones get a single canonical shape. Surface them in different views — keep the underlying data honest.",
  },
  {
    title: "Pay on delivery.",
    body: "We earn when campaigns ship. So should creators. So should the brands they work with. Aligned incentives, not aspirational ones.",
  },
  {
    title: "Trust, not vibes.",
    body: "Scores, audit trails, signatures. Decisions backed by data instead of who has the flashiest deck or the loudest DM voice.",
  },
];
