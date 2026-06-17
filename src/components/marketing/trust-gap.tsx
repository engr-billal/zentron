import { FileStack, MessageSquareOff, Receipt } from "lucide-react";
import { Section } from "./section";

const pains = [
  {
    icon: FileStack,
    title: "Work lives everywhere",
    body: "Briefs in Notion, contracts in email, deliverables in Drive. Nobody has the full picture.",
  },
  {
    icon: MessageSquareOff,
    title: "Outreach doesn't scale",
    body: "Brands cold-DM creators. Creators ignore most of it. Matching should start from a clear brief.",
  },
  {
    icon: Receipt,
    title: "Payments lack structure",
    body: "Upfront Venmo or net-30 invoices — neither side gets milestones, proof, or a shared record.",
  },
];

export function TrustGap() {
  return (
    <Section id="why" eyebrow="Why teams switch">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <h2 className="font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl">
          Sponsored content runs on{" "}
          <span className="italic text-brand">duct tape.</span>
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
          Most campaigns still depend on spreadsheets, PDFs, and DMs. Zentron
          gives both sides a shared workspace from the first brief through
          signed contracts and milestone delivery.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {pains.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group relative flex flex-col gap-4 rounded-2xl bg-card p-7 ring-1 ring-border transition-all duration-300 hover:ring-brand/40"
            >
              <span
                aria-hidden
                className="absolute inset-x-7 top-0 h-px bg-brand transition-all duration-500 group-hover:inset-x-0"
              />
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-surface text-brand ring-1 ring-border">
                <Icon className="size-4" />
              </span>
              <h3 className="font-display text-xl text-ink">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
