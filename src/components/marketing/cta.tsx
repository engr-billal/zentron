"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { WaitlistForm } from "./waitlist-form";

export function CTA() {
  return (
    <section
      id="waitlist"
      className="relative isolate overflow-hidden border-t border-border bg-ink px-6 py-28 text-paper sm:px-10 lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 text-brand/15 bg-grain"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-brand/25 blur-3xl"
      />

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-3 py-1 text-xs text-paper/70"
        >
          <span className="size-1.5 rounded-full bg-brand" />
          Now onboarding launch partners
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 font-display text-4xl leading-[1.1] text-balance sm:text-5xl lg:text-6xl"
        >
          Let&apos;s build{" "}
          <span className="italic text-brand">the trust layer</span> the
          creator economy actually needs.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-pretty text-paper/70"
        >
          We&apos;re onboarding the first cohort of brands and creators for
          private beta. Drop your email — we&apos;ll send a single note when
          your side opens up.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-9 flex flex-col items-center gap-4"
        >
          <WaitlistForm source="landing-cta" variant="dark" />

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="sm" variant="brand">
              <a href="/sign-up">
                Or get early access
                <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
            <a
              href="mailto:usman@zentronsolutions.com"
              className="text-xs text-paper/60 underline-offset-4 hover:text-paper hover:underline"
            >
              Talk to founders
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

