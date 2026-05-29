import { Pricing } from "@/components/marketing/pricing";
import { CTA } from "@/components/marketing/cta";

export const metadata = {
  title: "Pricing",
  description:
    "Pay-per-success commission, Scale subscription, and à la carte services.",
};

export default function PricingPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-paper px-6 pt-32 pb-12 sm:px-10 lg:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 text-ink/[0.06] bg-grain"
        />
        <div className="mx-auto w-full max-w-4xl text-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
            Pricing
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[1.1] text-balance text-ink sm:text-6xl">
            Pay only when{" "}
            <span className="italic text-brand">campaigns ship.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground">
            Free for both sides to join. We earn 8% commission on live
            campaigns, plus an optional Scale subscription and a few à la
            carte services.
          </p>
        </div>
      </section>

      <Pricing />
      <CTA />
    </>
  );
}
