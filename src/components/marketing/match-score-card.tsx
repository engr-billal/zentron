"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";

const dimensions = [
  { label: "Audience overlap", value: 91 },
  { label: "Engagement quality", value: 88 },
  { label: "Content style fit", value: 96 },
  { label: "Historical performance", value: 82 },
  { label: "Audience health", value: 94 },
];

const finalScore = 94;

export function MatchScoreCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-brand/15 via-transparent to-transparent blur-2xl"
      />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_60px_-24px_oklch(0.18_0.01_60_/_0.25)]">
        <div className="flex items-center justify-between border-b border-border bg-surface/60 px-5 py-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-brand" />
            Match preview
          </div>
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Summer launch brief
          </span>
        </div>

        <div className="grid gap-5 px-5 py-6 sm:grid-cols-[auto_1fr] sm:gap-7">
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-ink p-5 text-paper sm:w-44">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-display text-6xl leading-none text-brand"
            >
              {finalScore}
            </motion.span>
            <span className="text-xs uppercase tracking-[0.18em] text-paper/60">
              out of 100
            </span>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-paper/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-paper/80">
              Top 0.4%
            </span>
          </div>

          <ul className="flex flex-col gap-3">
            {dimensions.map((d, i) => (
              <li key={d.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{d.label}</span>
                  <span className="font-medium tabular-nums text-ink">
                    {d.value}
                  </span>
                </div>
                <div className="relative h-1.5 overflow-hidden rounded-full bg-surface">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${d.value}%` } : undefined}
                    transition={{
                      duration: 0.9,
                      delay: 0.3 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full rounded-full bg-brand"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 border-t border-border bg-surface/60 px-5 py-3 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-brand" />
          Scored on 5 dimensions · updates with your platforms
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="absolute -bottom-6 -left-4 hidden rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm sm:block"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-brand/10 text-[10px] font-medium text-brand">
            £
          </span>
          <div>
            <p className="font-medium text-ink">£2,400 contract</p>
            <p className="text-[11px] text-muted-foreground">
              3 milestones
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, delay: 1.05 }}
        className="absolute -top-5 -right-2 hidden rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-sm sm:block"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-ink text-[10px] font-medium text-paper">
            ✓
          </span>
          <div>
            <p className="font-medium text-ink">Contract signed</p>
            <p className="text-[11px] text-muted-foreground">In-platform</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
