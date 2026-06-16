"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Section } from "./section";

type Stat = {
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
  source: string;
};

const stats: Stat[] = [
  {
    prefix: "$",
    value: 1.3,
    suffix: "B+",
    label: "Estimated annual losses from influencer fraud worldwide (2023).",
    source: "HypeAuditor · State of Influencer Marketing 2024",
  },
  {
    prefix: "~",
    value: 49,
    suffix: "%",
    label: "Of marketers cite measuring influencer campaign ROI as a top challenge.",
    source: "Influencer Marketing Hub · Benchmark Report 2024",
  },
  {
    value: 3,
    suffix: "–5×",
    label: "Typical spread in creator rate quotes for the same deliverable scope.",
    source: "Zentron founder interviews · 2025–2026",
  },
];

function CountUp({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toFixed(decimals)}
    </span>
  );
}

export function TrustGap() {
  return (
    <Section
      id="problem"
      eyebrow={{ number: "01", label: "The trust gap" }}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <h2 className="font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl">
          The trust gap is{" "}
          <span className="italic text-brand">wider than ever.</span>
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
          Both sides — brands and creators — have learned to expect the worst.
          Fake audiences, ghost delivery, opaque pricing, AI spam. The order of
          magnitude tells the story.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group relative flex flex-col gap-4 rounded-2xl bg-card p-7 ring-1 ring-border transition-all duration-300 hover:ring-brand/40"
          >
            <span
              aria-hidden
              className="absolute inset-x-7 top-0 h-px bg-brand transition-all duration-500 group-hover:inset-x-0"
            />
            <span className="font-display text-5xl leading-none text-ink">
              {s.prefix}
              <CountUp
                to={s.value}
                decimals={s.value % 1 === 0 ? 0 : 1}
              />
              {s.suffix}
            </span>
            <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
              {s.label}
            </p>
            <span className="mt-auto text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
              {s.source}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-10 max-w-2xl border-l-2 border-brand pl-4 text-sm italic text-muted-foreground">
        Brands don&apos;t need more creators. They need creators they can trust.
        And creators don&apos;t want more brand DMs — they want partnerships
        that respect their work and pay them on time.
      </p>
    </Section>
  );
}
