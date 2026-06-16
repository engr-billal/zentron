import {
  LegalPageShell,
  LegalSection,
} from "../_components/legal-page-shell";

export const metadata = {
  title: "Privacy policy",
  description: "How Zentron Solutions handles your personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy policy" updated="31 May 2026">
      <p>
        Zentron Solutions Ltd (&ldquo;Zentron&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;) operates the platform at zentronsolutions.com. This
        policy explains what personal data we collect, why we use it, and the
        choices you have. It applies to visitors, waitlist sign-ups, and
        registered brand and creator accounts.
      </p>

      <LegalSection title="Who we are">
        <p>
          Zentron Solutions Ltd is the data controller for personal data
          processed through the platform. Contact{" "}
          <a
            href="mailto:privacy@zentronsolutions.com"
            className="font-medium text-ink hover:text-brand"
          >
            privacy@zentronsolutions.com
          </a>{" "}
          for privacy requests.
        </p>
      </LegalSection>

      <LegalSection title="Data we collect">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Account data:</strong> email address, password hash (for
            email sign-up), OAuth provider identifier (for Google sign-in),
            display name, country, and role (brand or creator).
          </li>
          <li>
            <strong>Profile data:</strong> brand company details, creator
            channel and audience information, niches, platforms, and other
            fields you submit during onboarding or in settings.
          </li>
          <li>
            <strong>Platform activity:</strong> briefs, invitations, contracts,
            milestones, reviews, and messages generated through the product.
          </li>
          <li>
            <strong>Waitlist data:</strong> email, role intent, and referral
            source when you join the waitlist.
          </li>
          <li>
            <strong>Technical data:</strong> session cookies, IP address,
            browser type, and server logs needed to operate and secure the
            service.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How we use your data">
        <p>We process personal data to:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>create and manage your account;</li>
          <li>match brands with creators and run contract workflows;</li>
          <li>send transactional emails (verification, password reset, contract updates);</li>
          <li>improve reliability, prevent abuse, and enforce our terms;</li>
          <li>comply with legal obligations.</li>
        </ul>
        <p className="mt-3">
          We do not sell your personal data. We do not use your data for
          third-party advertising during early access.
        </p>
      </LegalSection>

      <LegalSection title="Legal bases (UK GDPR)">
        <p>
          Where UK GDPR applies, we rely on: (a) contract — to provide the
          service you signed up for; (b) legitimate interests — to secure and
          improve the platform; (c) consent — where required, e.g. non-essential
          cookies or marketing; and (d) legal obligation — where we must retain
          or disclose data by law.
        </p>
      </LegalSection>

      <LegalSection title="Processors and storage">
        <p>
          Application data is hosted in our Supabase project (PostgreSQL,
          authentication, and storage). Email is sent through transactional
          email providers acting as processors under data-processing terms. We
          choose providers with appropriate security and, where relevant, UK/EU
          data transfer safeguards.
        </p>
      </LegalSection>

      <LegalSection title="Retention">
        <p>
          We keep account and platform data while your account is active. If you
          delete your account, we remove or anonymise personal data within a
          reasonable period, except where we must retain records for legal,
          tax, or dispute purposes.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Depending on your location, you may have rights to access, correct,
          delete, restrict, or port your data, and to object to certain
          processing. You may also lodge a complaint with the UK Information
          Commissioner&apos;s Office (ICO). To exercise your rights, email{" "}
          <a
            href="mailto:privacy@zentronsolutions.com"
            className="font-medium text-ink hover:text-brand"
          >
            privacy@zentronsolutions.com
          </a>
          . We respond within one month where required by law.
        </p>
      </LegalSection>

      <LegalSection title="International transfers">
        <p>
          If data is processed outside the UK, we use appropriate safeguards
          such as UK International Data Transfer Agreements or equivalent
          mechanisms.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          Zentron is not directed at children under 16. We do not knowingly
          collect data from children. Contact us if you believe a child has
          provided personal data.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We update this policy when our practices change. Material changes are
          reflected in the &ldquo;Updated&rdquo; date above. Continued use after
          an update constitutes acceptance where permitted by law.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
