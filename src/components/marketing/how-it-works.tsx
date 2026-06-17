"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import {
  ClipboardList,
  FileSignature,
  Megaphone,
  Send,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { Section } from "./section";

const steps = [
  {
    icon: ClipboardList,
    title: "Write a brief",
    description: "Set objective, audience, deliverables, and budget in the wizard.",
  },
  {
    icon: Sparkles,
    title: "Review matches",
    description: "Creators ranked by fit score. Invite the ones you want.",
  },
  {
    icon: UserCheck,
    title: "Creators opt in",
    description: "No cold DMs — creators respond to briefs that match them.",
  },
  {
    icon: FileSignature,
    title: "Sign a contract",
    description: "Fees, milestones, and dates agreed in one place.",
  },
  {
    icon: Megaphone,
    title: "Deliver & review",
    description: "Submit work, approve milestones, and leave a review.",
  },
  {
    icon: Send,
    title: "Payments (soon)",
    description: "Milestone escrow and payouts — tracked in-app today, rails shipping next.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <Section id="how" eyebrow="Workflow">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <h2 className="font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl">
          From brief to{" "}
          <span className="italic text-brand">finished campaign.</span>
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
          The brief builder is five steps inside the app. The full campaign
          lifecycle below is what happens after you publish — matching,
          contracting, delivery, and (soon) payment release per milestone.
        </p>
      </div>

      <div ref={ref} className="relative mt-14">
        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-surface ring-1 ring-border">
                    <Icon className="size-4 text-ink" />
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Step {i + 1}
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
