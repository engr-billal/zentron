import { Section } from "@/components/marketing/section";

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Zentron.",
};

const faqs = [
  {
    q: "Is Zentron free during early access?",
    a: "Yes. Brands and creators can join, write briefs, and run contracts without platform fees while we onboard cohorts.",
  },
  {
    q: "How does the Zentron Score work?",
    a: "Creators receive a 0–100 score from five dimensions: audience size, engagement, niche premium, platform mix, and track record. Both sides see the same fair-rate range derived from that score.",
  },
  {
    q: "When do payments and escrow go live?",
    a: "Milestone tracking and reviews are live today. Stripe-powered escrow and payouts are planned for a later release — we will announce in-app before any money movement.",
  },
  {
    q: "Can one person have both a brand and creator account?",
    a: "Each email maps to one role today. If you wear both hats, use separate emails or contact us for a multi-role setup.",
  },
  {
    q: "How do invite links work?",
    a: "Brands generate a time-limited link on an open brief. Creators redeem it while signed in to join the invitation list without cold outreach.",
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-paper px-6 pt-32 pb-12 sm:px-10 lg:pt-40">
        <div className="mx-auto w-full max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
            FAQ
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[1.1] text-balance text-ink sm:text-6xl">
            Questions,{" "}
            <span className="italic text-brand">answered.</span>
          </h1>
        </div>
      </section>

      <Section eyebrow="Common questions">
        <dl className="flex flex-col gap-4">
          {faqs.map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <dt className="font-display text-lg text-ink">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
