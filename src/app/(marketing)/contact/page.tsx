import { Mail } from "lucide-react";
import { Section } from "@/components/marketing/section";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

export const metadata = {
  title: "Contact",
  description:
    "Talk to the founders, join the waitlist, or send a partnership note.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-paper px-6 pt-32 pb-12 sm:px-10 lg:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 text-ink/[0.06] bg-grain"
        />
        <div className="mx-auto w-full max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
            Contact
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[1.1] text-balance text-ink sm:text-6xl">
            Let&apos;s {" "}
            <span className="italic text-brand">talk.</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            We read every email. Founders reply within a couple of working
            days — usually faster.
          </p>
        </div>
      </section>

      <Section eyebrow={{ number: "01", label: "Reach us" }}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
              Join the waitlist
            </p>
            <h2 className="mt-2 font-display text-2xl text-ink">
              Get notified when your side opens up.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Brand or creator — we onboard in cohorts. Drop your email and
              we&apos;ll let you in when there&apos;s capacity.
            </p>
            <div className="mt-6">
              <WaitlistForm source="contact-page" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
              Direct
            </p>
            <h2 className="mt-2 font-display text-2xl text-ink">
              Email the founders.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              For partnerships, press, or anything that doesn&apos;t fit a
              form.
            </p>
            <a
              href="mailto:usman@zentronsolutions.com"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:text-brand"
            >
              <Mail className="size-3.5" />
              usman@zentronsolutions.com
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
