import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { Marquee } from "@/components/marketing/marquee";
import { TrustGap } from "@/components/marketing/trust-gap";
import { Solution } from "@/components/marketing/solution";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ZentronScore } from "@/components/marketing/zentron-score";
import { Escrow } from "@/components/marketing/escrow";
import { Pricing } from "@/components/marketing/pricing";
import { Vision } from "@/components/marketing/vision";
import { CTA } from "@/components/marketing/cta";
import { Footer } from "@/components/marketing/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <TrustGap />
        <Solution />
        <HowItWorks />
        <ZentronScore />
        <Escrow />
        <Pricing />
        <Vision />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
