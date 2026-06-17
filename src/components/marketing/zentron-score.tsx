"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Section } from "./section";

type Dimension = {
  title: string;
  subtitle: string;
  tone: "light" | "dark";
  detail: string[];
  caption: string;
  weight: number;
  sample: number;
};

const dimensions: Dimension[] = [
  {
    title: "Audience size",
    subtitle: "Reach band",
    tone: "light",
    detail: ["Nano through mega tiers", "Based on your connected platforms"],
    caption: "Sets the floor for the range.",
    weight: 0.2,
    sample: 76,
  },
  {
    title: "Engagement",
    subtitle: "Quality of attention",
    tone: "light",
    detail: ["Likes, comments, saves, shares", "Weighted against follower count"],
    caption: "High engagement beats vanity reach.",
    weight: 0.25,
    sample: 92,
  },
  {
    title: "Niche",
    subtitle: "Category multiplier",
    tone: "light",
    detail: ["Finance, B2B, beauty, lifestyle", "Market-driven premiums"],
    caption: "Some categories command higher rates.",
    weight: 0.2,
    sample: 88,
  },
  {
    title: "Platform",
    subtitle: "Format value",
    tone: "light",
    detail: ["YouTube, podcast, Reels, TikTok", "Different floors per format"],
    caption: "Long-form and audio score higher.",
    weight: 0.15,
    sample: 84,
  },
  {
    title: "Track record",
    subtitle: "On-platform history",
    tone: "dark",
    detail: ["Completed contracts", "On-time delivery and reviews"],
    caption: "Reliability compounds over time.",
    weight: 0.2,
    sample: 94,
  },
];

function computeFinal(values: number[]) {
  const total = values.reduce(
    (sum, v, i) => sum + v * dimensions[i].weight,
    0,
  );
  return Math.round(total);
}

export function ZentronScore() {
  const [active, setActive] = useState(0);
  const values = dimensions.map((d) => d.sample);
  const final = computeFinal(values);

  return (
    <Section id="score" eyebrow="Zentron Score" className="bg-surface/40">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <h2 className="font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl">
          A shared benchmark{" "}
          <span className="italic text-brand">before you negotiate.</span>
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
          Every creator gets a 0–100 score and a suggested fair-rate range.
          Brands see the same numbers on match previews — so pricing starts
          from data, not guesswork.
        </p>
      </div>

      <div className="mt-12 grid gap-3 lg:grid-cols-5">
        {dimensions.map((d, index) => {
          const isActive = active === index;
          const isDark = d.tone === "dark";
          return (
            <button
              type="button"
              key={d.title}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              className={cn(
                "group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-5 text-left transition-all duration-300",
                isDark
                  ? "bg-ink text-paper ring-1 ring-ink"
                  : "bg-card text-ink ring-1 ring-border hover:ring-brand/40",
                isActive && !isDark && "ring-brand/60",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-5 top-0 h-px bg-brand transition-all duration-500",
                  isActive && "inset-x-0",
                )}
              />
              <h3
                className={cn(
                  "font-display text-lg",
                  isDark ? "text-paper" : "text-ink",
                )}
              >
                {d.title}
              </h3>
              <p
                className={cn(
                  "text-xs",
                  isDark ? "text-paper/70" : "text-muted-foreground",
                )}
              >
                {d.subtitle}
              </p>
              <ul
                className={cn(
                  "flex flex-col gap-1 text-sm",
                  isDark ? "text-paper/80" : "text-muted-foreground",
                )}
              >
                {d.detail.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid items-center gap-8 rounded-2xl border border-border bg-card p-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Example creator profile
          </p>
          <p className="mt-2 font-display text-7xl leading-none text-ink">
            <motion.span
              key={final}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-brand tabular-nums"
            >
              {final}
            </motion.span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Suggested range:{" "}
            <span className="font-medium text-ink tabular-nums">£1,800</span>
            {" – "}
            <span className="font-medium text-ink tabular-nums">£3,200</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Shown on creator dashboards and brand match previews.
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {dimensions.map((d, i) => (
            <li key={d.title} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{d.title}</span>
                <span className="font-medium tabular-nums text-ink">
                  {d.sample}
                </span>
              </div>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-surface">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${values[i]}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cn(
                    "h-full rounded-full",
                    active === i ? "bg-brand" : "bg-ink/30",
                  )}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
