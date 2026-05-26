"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MatchScoreCard } from "./match-score-card";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-paper pt-32 pb-24 sm:pt-40 lg:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 text-ink/[0.06] bg-grain"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 px-6 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-1 text-xs text-muted-foreground"
          >
            <Sparkles className="size-3 text-brand" />
            Pre-seed · UK Limited · Built for both sides
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 font-display text-5xl leading-[1.05] text-balance text-ink sm:text-6xl lg:text-7xl"
          >
            The trust layer between{" "}
            <span className="italic text-brand">brands</span>
            <span aria-hidden className="px-1 text-brand">
              ×
            </span>
            <span className="italic text-brand">creators.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            Algorithmic matching. Smart contracts. Milestone-based escrow. The
            infrastructure sponsored content has been missing — replacing the
            broken DM-and-Venmo workflow with rails designed for both sides of
            the handshake.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg" className="h-11 px-5">
              <a href="#waitlist">
                Join as a brand
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-5">
              <a href="#waitlist">Apply as a creator</a>
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border/70 pt-6"
          >
            {[
              { label: "Avg release", value: "<48h" },
              { label: "Score signals", value: "5" },
              { label: "Commission", value: "8%" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-display text-2xl text-ink">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <MatchScoreCard />
        </motion.div>
      </div>
    </section>
  );
}
