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
    <LegalPageShell title="Terms of service" updated="31 May 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of the Zentron platform operated by Zentron Solutions Ltd
        (&ldquo;Zentron&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By
        creating an account or using the service, you agree to these Terms.
      </p>

      <LegalSection title="Eligibility">
        <p>
          You must be at least 16 years old and able to enter a binding contract
          in your jurisdiction. Brand accounts are for businesses or authorised
          representatives. Creator accounts are for the individual who owns or
          controls the channels listed on their profile.
        </p>
      </LegalSection>

      <LegalSection title="The service">
        <p>
          Zentron provides tools for brands and creators to discover each other,
          publish briefs, negotiate contracts, track milestones, and leave
          reviews. Zentron is a technology platform — we are not a party to
          contracts formed between users unless we explicitly state otherwise
          in writing.
        </p>
      </LegalSection>

      <LegalSection title="Accounts and security">
        <p>
          You are responsible for your credentials and all activity under your
          account. Provide accurate information and keep it up to date. Notify
          us promptly at{" "}
          <a
            href="mailto:support@zentronsolutions.com"
            className="font-medium text-ink hover:text-brand"
          >
            support@zentronsolutions.com
          </a>{" "}
          if you suspect unauthorised access.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>misrepresent your identity, audience, reach, or deliverables;</li>
          <li>use the platform to circumvent advertising disclosure laws;</li>
          <li>harass, defraud, or abuse other users;</li>
          <li>attempt to breach security or scrape data without permission;</li>
          <li>upload unlawful, infringing, or harmful content.</li>
        </ul>
        <p className="mt-3">
          We may suspend or terminate accounts that violate these Terms or pose
          risk to the community.
        </p>
      </LegalSection>

      <LegalSection title="Contracts between users">
        <p>
          When a brand and creator enter a contract on Zentron, they form a
          direct agreement with each other. Each party is responsible for
          deliverables, payments (when enabled), taxes, and regulatory
          compliance. Zentron does not guarantee campaign outcomes.
        </p>
      </LegalSection>

      <LegalSection title="Fees">
        <p>
          Early access is currently free for brands and creators. When paid
          plans or commission models launch, we will present pricing in-app
          before any charge. You may stop using the service if you do not agree
          to new fees.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          Zentron owns the platform, branding, and software. You retain rights
          to content you upload. You grant Zentron a limited licence to host
          and display your content solely to operate the service.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimers">
        <p>
          The service is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; to the fullest extent permitted by law. We do not
          warrant uninterrupted or error-free operation.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the extent permitted by law, Zentron is not liable for indirect,
          incidental, special, or consequential losses, or for losses arising
          from contracts between users. Our total liability for claims relating
          to the service is limited to the greater of £100 or the fees you paid
          us in the twelve months before the claim.
        </p>
      </LegalSection>

      <LegalSection title="Termination">
        <p>
          You may close your account at any time. We may suspend or terminate
          access for breach of these Terms or to protect the platform. Sections
          that by nature should survive termination will survive.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These Terms are governed by the laws of England and Wales. Courts in
          England and Wales have exclusive jurisdiction, subject to mandatory
          consumer protections in your country of residence.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these Terms:{" "}
          <a
            href="mailto:legal@zentronsolutions.com"
            className="font-medium text-ink hover:text-brand"
          >
            legal@zentronsolutions.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
