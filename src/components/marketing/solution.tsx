import { FileSignature, Network, ShieldCheck } from "lucide-react";
import { Section } from "./section";
import { NumberedCard } from "./numbered-card";

const primitives = [
  {
    number: "01",
    title: "Algorithmic matching",
    icon: Network,
    description:
      "Five-dimension scoring beyond follower count — audience overlap, engagement quality, content style fit, historical performance, and audience health.",
  },
  {
    number: "02",
    title: "Smart contracts",
    icon: FileSignature,
    description:
      "Standardized digital agreements. Clear scope, deliverables, exclusivity, and usage rights — signed in-platform, stored forever.",
  },
  {
    number: "03",
    title: "Milestone escrow",
    icon: ShieldCheck,
    description:
      "Funds locked at signing. Released progressively as work is verified. Average release under 48 hours. Disputes resolved in-platform.",
  },
];

export function Solution() {
  return (
    <Section
      id="solution"
      eyebrow={{ number: "02", label: "The solution" }}
      className="bg-surface/40"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <h2 className="font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl">
          One platform.{" "}
          <span className="italic text-brand">Three primitives.</span>
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
          Zentron replaces the broken DM-and-Venmo workflow with infrastructure
          designed for both sides of the handshake. Each primitive is gated by
          a verification or contract trigger — nothing happens on a handshake
          and a hope.
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {primitives.map((p) => {
          const Icon = p.icon;
          return (
            <NumberedCard
              key={p.number}
              number={p.number}
              title={p.title}
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface text-ink ring-1 ring-border">
                  <Icon className="size-4" />
                </span>
                <p>{p.description}</p>
              </div>
            </NumberedCard>
          );
        })}
      </div>
    </Section>
  );
}
