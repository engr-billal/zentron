import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "./section";

type Column = {
  era: string;
  title: string;
  points: { ok: boolean; text: string }[];
  verdict: string;
  highlight?: boolean;
};

const columns: Column[] = [
  {
    era: "The DM-and-Venmo era",
    title: "Upfront-pay",
    points: [
      { ok: false, text: "Brand pays 100% before work" },
      { ok: false, text: "Creator may underdeliver" },
      { ok: false, text: "No accountability" },
      { ok: false, text: "Disputes = direct conflict" },
    ],
    verdict: "Bad for brands.",
  },
  {
    era: "The agency standard",
    title: "Net-30 invoicing",
    points: [
      { ok: false, text: "Creator delivers, then waits" },
      { ok: false, text: "30–90 day payment delays" },
      { ok: false, text: "Late payments are normal" },
      { ok: false, text: "Cash flow killer" },
    ],
    verdict: "Bad for creators.",
  },
  {
    era: "The Zentron way",
    title: "Milestone escrow",
    points: [
      { ok: true, text: "Fee escrowed at signing" },
      { ok: true, text: "Released per milestone" },
      { ok: true, text: "Avg release: under 48h" },
      { ok: true, text: "In-platform disputes" },
    ],
    verdict: "Built for both sides.",
    highlight: true,
  },
];

export function Escrow() {
  return (
    <Section
      id="escrow"
      eyebrow={{ number: "05", label: "Payment infrastructure" }}
      className="bg-surface/40"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <h2 className="font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl">
          Payment that{" "}
          <span className="italic text-brand">moves with the work.</span>
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
          Both upfront pay and net-30 are broken in different directions. Escrow
          tied to milestones is the only model where the incentives line up on
          both sides from day one.
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {columns.map((col) => (
          <div
            key={col.title}
            className={cn(
              "group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-7 transition-all duration-300",
              col.highlight
                ? "bg-ink text-paper ring-1 ring-ink shadow-[0_24px_60px_-24px_oklch(0.18_0.01_60_/_0.35)]"
                : "bg-card text-ink ring-1 ring-border",
            )}
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-brand"
            />
            <div>
              <p
                className={cn(
                  "text-[11px] uppercase tracking-[0.18em]",
                  col.highlight ? "text-paper/60" : "text-muted-foreground",
                )}
              >
                {col.era}
              </p>
              <h3
                className={cn(
                  "mt-2 font-display text-2xl",
                  col.highlight ? "text-paper" : "text-ink",
                )}
              >
                {col.title}
              </h3>
            </div>
            <ul className="flex flex-col gap-2">
              {col.points.map((p) => (
                <li
                  key={p.text}
                  className={cn(
                    "flex items-start gap-2 text-sm",
                    col.highlight ? "text-paper/85" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full",
                      p.ok
                        ? "bg-brand/15 text-brand"
                        : col.highlight
                          ? "bg-paper/10 text-paper/70"
                          : "bg-surface text-muted-foreground",
                    )}
                  >
                    {p.ok ? (
                      <Check className="size-2.5" strokeWidth={3} />
                    ) : (
                      <X className="size-2.5" strokeWidth={3} />
                    )}
                  </span>
                  <span>{p.text}</span>
                </li>
              ))}
            </ul>
            <p
              className={cn(
                "mt-auto pt-3 text-sm italic",
                col.highlight ? "text-brand" : "text-muted-foreground/80",
              )}
            >
              {col.verdict}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
