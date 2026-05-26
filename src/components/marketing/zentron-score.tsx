"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Section } from "./section";

type Dimension = {
  number: string;
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
    number: "01",
    title: "Audience Size",
    subtitle: "The floor.",
    tone: "light",
    detail: ["Nano (1K–10K)", "Micro (10K–100K)", "Mid (100K–500K)", "Macro (500K–1M)", "Mega (1M+)"],
    caption: "Reach band sets the base.",
    weight: 0.2,
    sample: 76,
  },
  {
    number: "02",
    title: "Engagement",
    subtitle: "The multiplier.",
    tone: "light",
    detail: ["Likes + comments", "+ saves + shares", "÷ followers", "High-engagement beats high-count."],
    caption: "Quality of attention, not just volume.",
    weight: 0.25,
    sample: 92,
  },
  {
    number: "03",
    title: "Niche Premium",
    subtitle: "Some pay more.",
    tone: "light",
    detail: ["Finance: 3×", "B2B / Tech: 2.5×", "Beauty: 1.5×", "Lifestyle: 1×"],
    caption: "Market-driven multipliers.",
    weight: 0.2,
    sample: 88,
  },
  {
    number: "04",
    title: "Platform",
    subtitle: "Format matters.",
    tone: "light",
    detail: ["YouTube long >", "Podcast >", "Reels > TikTok", "Static > Stories"],
    caption: "Different floors per format.",
    weight: 0.15,
    sample: 84,
  },
  {
    number: "05",
    title: "Track Record",
    subtitle: "Our moat.",
    tone: "dark",
    detail: ["On-time, on-brief campaigns", "earn a higher Score.", "Real money value.", "Compounds over time."],
    caption: "Reliability is priced in.",
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
  const [active, setActive] = useState<string>(dimensions[0].number);
  const values = dimensions.map((d) => d.sample);
  const final = computeFinal(values);

  return (
    <Section
      id="score"
      eyebrow={{ number: "04", label: "Fair rate engine" }}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <h2 className="font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl">
          The <span className="italic text-brand">Zentron Score.</span>{" "}
          How we price creators fairly.
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
          Follower count alone is a trap. A creator with 30K engaged followers
          can outperform one with 500K disengaged. We score across five
          layers — and let the market price each creator fairly.
        </p>
      </div>

      <div className="mt-14 grid gap-3 lg:grid-cols-5">
        {dimensions.map((d) => {
          const isActive = active === d.number;
          const isDark = d.tone === "dark";
          return (
            <button
              type="button"
              key={d.number}
              onMouseEnter={() => setActive(d.number)}
              onFocus={() => setActive(d.number)}
              onClick={() => setActive(d.number)}
              className={cn(
                "group relative flex flex-col gap-4 overflow-hidden rounded-2xl p-6 text-left transition-all duration-300",
                isDark
                  ? "bg-ink text-paper ring-1 ring-ink"
                  : "bg-card text-ink ring-1 ring-border hover:ring-brand/40",
                isActive && !isDark && "ring-brand/60 shadow-[0_8px_30px_-12px_oklch(0.18_0.01_60_/_0.18)]",
                isActive && isDark && "shadow-[0_8px_30px_-12px_oklch(0.18_0.01_60_/_0.4)]",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-6 top-0 h-px bg-brand transition-all duration-500",
                  isActive && "inset-x-0",
                )}
              />
              <span
                className={cn(
                  "text-[11px] uppercase tracking-[0.18em]",
                  "text-brand",
                )}
              >
                {d.number}
              </span>
              <div>
                <h3
                  className={cn(
                    "font-display text-xl",
                    isDark ? "text-paper" : "text-ink",
                  )}
                >
                  {d.title}
                </h3>
                <p
                  className={cn(
                    "mt-1 text-sm italic",
                    isDark ? "text-paper/70" : "text-muted-foreground",
                  )}
                >
                  {d.subtitle}
                </p>
              </div>
              <ul
                className={cn(
                  "mt-2 flex flex-col gap-1 text-sm",
                  isDark ? "text-paper/80" : "text-muted-foreground",
                )}
              >
                {d.detail.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p
                className={cn(
                  "mt-auto pt-3 text-xs",
                  isDark ? "text-paper/60" : "text-muted-foreground/80",
                )}
              >
                {d.caption}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-12 grid items-center gap-8 rounded-2xl border border-border bg-card p-8 lg:grid-cols-[1fr_1.4fr] lg:p-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Sample creator · @kira.studio
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
            Suggested fair range:{" "}
            <span className="font-medium text-ink tabular-nums">£1,800</span>
            {" – "}
            <span className="font-medium text-ink tabular-nums">£3,200</span>
          </p>
          <p className="mt-4 text-xs italic text-muted-foreground">
            Both sides see the same range. Creators set their rate within it.
            Brands know what fair looks like — before anyone talks.
          </p>
        </div>

        <ul className="flex flex-col gap-3">
          {dimensions.map((d, i) => (
            <li key={d.number} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-brand">{d.number}</span>
                  {d.title}
                </span>
                <span className="font-medium tabular-nums text-ink">
                  {d.sample} × {d.weight.toFixed(2)}
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
                    "h-full rounded-full transition-opacity",
                    active === d.number ? "bg-brand" : "bg-ink/40",
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
