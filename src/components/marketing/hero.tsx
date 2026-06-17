"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MatchScoreCard } from "./match-score-card";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-paper pt-32 pb-20 sm:pt-40 lg:pt-44">
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
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand"
          >
            Brand–creator campaigns
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-4 font-display text-5xl leading-[1.05] text-balance text-ink sm:text-6xl lg:text-[4.25rem]"
          >
            Briefs, contracts, and milestones —{" "}
            <span className="italic text-brand">one workspace.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            Zentron is where brands write briefs, get matched with creators,
            sign contracts, and track deliverables step by step. No more
            scattered docs, DMs, and invoice chasing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg" className="h-11 px-5">
              <Link href="/sign-up?role=brand">
                Start as a brand
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-5">
              <Link href="/sign-up?role=creator">Join as a creator</Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-4 text-sm text-muted-foreground"
          >
            Free during early access. No credit card required.
          </motion.p>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border/70 pt-6"
          >
            {[
              { label: "Brief wizard", value: "5 steps" },
              { label: "Match score", value: "5 signals" },
              { label: "To join", value: "Free" },
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
