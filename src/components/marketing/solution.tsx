import Link from "next/link";
import {
  ClipboardList,
  FileSignature,
  LayoutDashboard,
  LineChart,
  Users,
} from "lucide-react";
import { Section } from "./section";

const features = [
  {
    icon: ClipboardList,
    title: "Brief builder",
    description:
      "Five-step wizard for audience, deliverables, budget, and terms. Save drafts and publish when ready.",
  },
  {
    icon: Users,
    title: "Creator matching",
    description:
      "See ranked creators for each brief. Send invitations or share an invite link.",
  },
  {
    icon: FileSignature,
    title: "Contracts",
    description:
      "Standard templates with milestones, fees, and dates — sent and signed inside the app.",
  },
  {
    icon: LineChart,
    title: "Zentron Score",
    description:
      "A 0–100 score and fair-rate band both sides see before anyone negotiates.",
  },
  {
    icon: LayoutDashboard,
    title: "Campaign dashboard",
    description:
      "Track active collabs, submit deliverables, approve milestones, and leave reviews.",
  },
];

export function Solution() {
  return (
    <Section id="features" eyebrow="Features" className="bg-surface/40">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <h2 className="font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl">
          Everything you need to{" "}
          <span className="italic text-brand">run a collab.</span>
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
          One product for the full workflow — not a marketplace bolted onto
          email. Brands and creators each get a dashboard built for their side
          of the deal.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-brand/40"
            >
              <span
                aria-hidden
                className="absolute inset-x-6 top-0 h-px bg-brand opacity-0 transition-opacity group-hover:opacity-100"
              />
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-surface text-ink ring-1 ring-border">
                <Icon className="size-4" />
              </span>
              <h3 className="font-display text-xl text-ink">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          );
        })}
        <div className="flex flex-col justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 p-6 sm:col-span-2 lg:col-span-1">
          <p className="font-display text-lg text-ink">See it by role</p>
          <p className="text-sm text-muted-foreground">
            Different dashboards for brands and creators — same underlying
            contracts and milestones.
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            <Link
              href="/for-brands"
              className="text-sm font-medium text-brand hover:underline"
            >
              For brands →
            </Link>
            <Link
              href="/for-creators"
              className="text-sm font-medium text-brand hover:underline"
            >
              For creators →
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
