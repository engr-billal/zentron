"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Section } from "./section";

const milestones = [
  {
    year: "Year 1",
    title: "Prove the model",
    body: "500 verified creators. 30 paying brand partners. Two anchor verticals — D2C and AI tools. Public rate-card v1 live.",
  },
  {
    year: "Year 3",
    title: "Cross-market scale",
    body: "3,000 creators across 20 markets. Major brand-side integrations (Shopify, HubSpot). Performance-refund SLA proven at scale.",
  },
  {
    year: "Year 5",
    title: "Default infrastructure",
    body: "Every serious brand checks our trust score before signing a creator. Verified-by-Zentron becomes the industry standard.",
  },
];

export function Vision() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Section
      id="vision"
      eyebrow={{ number: "07", label: "The vision" }}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <h2 className="font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl">
          Become the trust layer{" "}
          <span className="italic text-brand">for the creator economy.</span>
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
          The creator economy is projected to reach $480B by 2027, growing at
          22% CAGR — faster than e-commerce or fintech. The tools to manage it
          haven&apos;t caught up. We&apos;re building the rails.
        </p>
      </div>

      <div ref={ref} className="relative mt-16">
        <div
          aria-hidden
          className="absolute top-3 left-0 hidden h-px w-full overflow-hidden bg-border md:block"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
            className="h-full w-full bg-brand"
          />
        </div>

        <ol className="grid gap-10 md:grid-cols-3">
          {milestones.map((m, i) => (
            <motion.li
              key={m.year}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative pt-10"
            >
              <span
                aria-hidden
                className="absolute top-0 left-0 size-2 rounded-full bg-brand ring-4 ring-paper"
              />
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {m.year}
              </p>
              <h3 className="mt-2 font-display text-2xl text-ink">
                {m.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground">
                {m.body}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>

      <div className="mt-16 grid gap-4 rounded-2xl border border-border bg-ink p-8 text-paper sm:grid-cols-4">
        {[
          { label: "TAM", value: "$480B", note: "Global creator economy by 2027" },
          { label: "SAM", value: "$78B", note: "Brand-creator sponsored content" },
          { label: "SOM", value: "$2.1B", note: "Mid-market brands + tier 2–3 creators · 5yr" },
          { label: "CAGR", value: "22%", note: "Faster than e-commerce or fintech" },
        ].map((m) => (
          <div key={m.label} className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.18em] text-brand">
              {m.label}
            </span>
            <span className="font-display text-3xl text-paper">{m.value}</span>
            <span className="text-xs text-paper/60">{m.note}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
