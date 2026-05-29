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
    <LegalPageShell title="Privacy policy" updated="May 2026">
      <p>
        This is a placeholder privacy notice covering Zentron Solutions Ltd
        (&ldquo;Zentron&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) and the
        services available at zentronsolutions.com. We&apos;ll replace it with
        a fully reviewed policy before the public launch.
      </p>

      <LegalSection title="What we collect">
        <p>
          Account data (email, display name, country, role), brand and
          creator profile information you submit, the briefs and contracts you
          create on the platform, and basic technical logs needed to operate
          the service.
        </p>
      </LegalSection>

      <LegalSection title="How we use it">
        <p>
          To operate Zentron — match briefs with creators, run the contract
          and milestone workflow, send transactional emails, and protect the
          service from abuse. We don&apos;t sell your data.
        </p>
      </LegalSection>

      <LegalSection title="Where it lives">
        <p>
          Application data lives in our Supabase project (Postgres,
          authentication, storage). Email is delivered through transactional
          email providers we trust to handle data carefully.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          You can export, edit, or delete your account data at any time.
          Contact{" "}
          <a
            href="mailto:privacy@zentronsolutions.com"
            className="font-medium text-ink hover:text-brand"
          >
            privacy@zentronsolutions.com
          </a>{" "}
          and we&apos;ll respond within a reasonable window.
        </p>
      </LegalSection>

      <LegalSection title="Updates">
        <p>
          We&apos;ll update this page as the product evolves. The date at the
          top of the page reflects the latest material change.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
