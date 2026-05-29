import {
  LegalPageShell,
  LegalSection,
} from "../_components/legal-page-shell";

export const metadata = {
  title: "Terms of service",
  description: "Rules for using the Zentron platform.",
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of service" updated="May 2026">
      <p>
        These are placeholder terms for early-access usage of Zentron
        Solutions Ltd&apos;s platform. They&apos;ll be replaced with a
        reviewed contract before public launch.
      </p>

      <LegalSection title="Eligibility">
        <p>
          You confirm you can lawfully enter contracts in your country. Brand
          accounts are for businesses; creator accounts are for the person who
          owns the channels.
        </p>
      </LegalSection>

      <LegalSection title="What Zentron does">
        <p>
          Zentron is a marketplace and contracting layer between brands and
          creators. We help with matching, contract templates, milestone
          tracking, and reviews. We are not a party to contracts you sign on
          the platform.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>
          Don&apos;t misrepresent your identity, audience, or capabilities.
          Don&apos;t use Zentron to circumvent local advertising regulations.
          Be honest in reviews. We may suspend accounts for repeated breaches.
        </p>
      </LegalSection>

      <LegalSection title="Fees">
        <p>
          The early-access platform is free for both sides. Once paid plans
          launch (Pay-per-success commission, Scale subscription), you&apos;ll
          see the relevant pricing in-app before any charge.
        </p>
      </LegalSection>

      <LegalSection title="Liability">
        <p>
          To the extent permitted by law, Zentron is provided as-is during
          early access. We&apos;re not liable for indirect or consequential
          losses arising from contracts you sign on the platform.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by the laws of England and Wales. Disputes
          fall under the courts of England and Wales unless local law
          requires otherwise.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
