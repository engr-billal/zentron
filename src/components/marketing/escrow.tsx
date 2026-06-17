import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "./section";

const columns = [
  {
    title: "Today",
    subtitle: "In the app now",
    points: [
      "Milestones on every contract",
      "Creators submit links and notes",
      "Brands approve or request changes",
      "Full audit trail per campaign",
    ],
    footer: "Milestone tracking is live.",
    highlight: true,
  },
  {
    title: "Spreadsheets & email",
    subtitle: "What most teams use",
    points: [
      "Deliverables in shared folders",
      "Approval over WhatsApp or Slack",
      "No version history",
      "Disputes become he-said-she-said",
    ],
    footer: "Hard to scale past a few creators.",
  },
  {
    title: "Coming next",
    subtitle: "On the roadmap",
    points: [
      "Escrow at contract signing",
      "Release per approved milestone",
      "In-platform dispute flow",
      "Payout rails via Stripe",
    ],
    footer: "Tracked milestones today; money movement next.",
  },
];

export function Escrow() {
  return (
    <Section id="milestones" eyebrow="Milestones">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <h2 className="font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl">
          Deliverables tied to{" "}
          <span className="italic text-brand">clear checkpoints.</span>
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
          Every contract breaks work into milestones. Creators submit proof;
          brands approve in the dashboard. Payment escrow connects to those
          same checkpoints — shipping after milestone tracking is proven in
          production.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {columns.map((col) => (
          <div
            key={col.title}
            className={cn(
              "group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-7",
              col.highlight
                ? "bg-ink text-paper ring-1 ring-ink"
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
                {col.subtitle}
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
              {col.points.map((text) => (
                <li
                  key={text}
                  className={cn(
                    "flex items-start gap-2 text-sm",
                    col.highlight ? "text-paper/85" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full",
                      col.highlight
                        ? "bg-brand/20 text-brand"
                        : "bg-surface text-muted-foreground",
                    )}
                  >
                    {col.highlight ? (
                      <Check className="size-2.5" strokeWidth={3} />
                    ) : (
                      <Clock className="size-2.5" strokeWidth={2} />
                    )}
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p
              className={cn(
                "mt-auto pt-2 text-sm",
                col.highlight ? "text-brand" : "text-muted-foreground",
              )}
            >
              {col.footer}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
