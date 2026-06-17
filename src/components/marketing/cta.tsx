"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section
      id="get-started"
      className="relative isolate overflow-hidden border-t border-border bg-ink px-6 py-24 text-paper sm:px-10 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 text-brand/15 bg-grain"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand/25 blur-3xl"
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand"
        >
          Get started
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-4 font-display text-4xl leading-[1.1] text-balance sm:text-5xl"
        >
          Create your account and{" "}
          <span className="italic text-brand">open the dashboard.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-paper/70"
        >
          Pick brand or creator after sign-up. The brief builder, matching,
          contracts, and milestone tools are ready to use in early access.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg" variant="brand" className="h-11 px-6">
            <Link href="/sign-up">
              Create free account
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-11 border-paper/25 bg-transparent px-6 text-paper hover:bg-paper/10 hover:text-paper"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 text-sm text-paper/50"
        >
          Prefer a walkthrough first?{" "}
          <Link
            href="/contact"
            className="text-paper/80 underline-offset-4 hover:text-paper hover:underline"
          >
            Book a call with the team
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
