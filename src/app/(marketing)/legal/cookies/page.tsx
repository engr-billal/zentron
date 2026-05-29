import {
  LegalPageShell,
  LegalSection,
} from "../_components/legal-page-shell";

export const metadata = {
  title: "Cookies",
  description: "How Zentron uses cookies and similar tech.",
};

export default function CookiesPage() {
  return (
    <LegalPageShell title="Cookie policy" updated="May 2026">
      <p>
        Placeholder cookie policy for the Zentron Solutions Ltd platform.
        We&apos;ll replace it with a reviewed version before public launch.
      </p>

      <LegalSection title="Strictly necessary">
        <p>
          Cookies that keep you signed in and protect against cross-site
          request forgery. Without these, the app can&apos;t function.
        </p>
      </LegalSection>

      <LegalSection title="Analytics">
        <p>
          We&apos;re not running third-party analytics during early access.
          When we do, we&apos;ll list each provider here, what they collect,
          and how to opt out.
        </p>
      </LegalSection>

      <LegalSection title="Marketing">
        <p>
          No marketing cookies right now. If we add retargeting later, this
          page will update first and we&apos;ll show a consent banner.
        </p>
      </LegalSection>

      <LegalSection title="Managing cookies">
        <p>
          You can delete cookies in your browser at any time. Deleting our
          essential cookies will sign you out.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
