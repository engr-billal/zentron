"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  ClipboardList,
  Sparkles,
  UserCheck,
  FileSignature,
  Megaphone,
  Banknote,
} from "lucide-react";
import { Section } from "./section";

const steps = [
  {
    step: "1",
    icon: ClipboardList,
    title: "Brief submitted",
    description: "Brand defines objectives, audience, deliverables, budget.",
  },
  {
    step: "2",
    icon: Sparkles,
    title: "Algorithm shortlists",
    description: "Top creators scored across 5 dimensions — auto-ranked.",
  },
  {
    step: "3",
    icon: UserCheck,
    title: "Creators opt in",
    description: "Pre-filtered list. No cold outreach, no DM spam.",
  },
  {
    step: "4",
    icon: FileSignature,
    title: "Contract signed",
    description: "Smart agreement, both parties signed in-platform.",
  },
  {
    step: "5",
    icon: Megaphone,
    title: "Campaign runs",
    description: "Milestones tracked, content verified, performance logged.",
  },
  {
    step: "6",
    icon: Banknote,
    title: "Payment released",
    description: "Escrow flows out per milestone — avg under 48 hours.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Section
      id="how"
      eyebrow={{ number: "03", label: "How it works" }}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <h2 className="font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl">
          Six steps from{" "}
          <span className="italic text-brand">brief to paid.</span>
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
          This is the full campaign lifecycle on Zentron — six steps from brief
          to payout. Writing the brief itself is a separate five-step wizard
          inside the dashboard.
        </p>
      </div>

      <div ref={ref} className="relative mt-16">
        <div
          aria-hidden
          className="absolute top-10 left-0 hidden h-px w-full overflow-hidden bg-border md:block"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
            className="h-full w-full bg-brand"
          />
        </div>

        <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.li
                key={s.step}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex flex-col gap-3"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-paper ring-1 ring-border">
                  <Icon className="size-4 text-ink" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl leading-none text-brand">
                    {s.step}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Step
                  </span>
                </div>
                <h3 className="font-display text-lg text-ink">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
