import Link from "next/link";
import { ArrowUpRight, Briefcase, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "./section";

const audiences = [
  {
    icon: Briefcase,
    role: "Brands",
    headline: "Run campaigns without the admin spiral.",
    bullets: [
      "Brief wizard with drafts and publishing",
      "Match scores and invitation tools",
      "Contracts with milestone breakdowns",
      "Campaign view for every active collab",
    ],
    href: "/for-brands",
    cta: "Explore for brands",
  },
  {
    icon: Sparkles,
    role: "Creators",
    headline: "Get briefs that fit — not random DMs.",
    bullets: [
      "Profile, platforms, and live Zentron Score",
      "Opt in to briefs you're matched to",
      "Submit milestones in one place",
      "Reviews that build your track record",
    ],
    href: "/for-creators",
    cta: "Explore for creators",
  },
];

export function AudienceSplit() {
  return (
    <Section eyebrow="Who it's for">
      <div className="mb-12 max-w-2xl">
        <h2 className="font-display text-4xl leading-[1.1] text-balance text-ink sm:text-5xl">
          Built for{" "}
          <span className="italic text-brand">both sides</span> of the deal.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Same contracts and milestones — different dashboards depending on
          whether you hire creators or get hired by brands.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {audiences.map((a) => {
          const Icon = a.icon;
          return (
            <div
              key={a.role}
              className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-8"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-display text-2xl text-ink">{a.role}</h3>
              </div>
              <p className="text-lg text-ink/90">{a.headline}</p>
              <ul className="flex flex-col gap-2">
                {a.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                    {b}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-auto w-fit">
                <Link href={a.href}>
                  {a.cta}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
