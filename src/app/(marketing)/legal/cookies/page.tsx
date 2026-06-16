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
    <LegalPageShell title="Cookie policy" updated="31 May 2026">
      <p>
        This policy explains how Zentron Solutions Ltd (&ldquo;Zentron&rdquo;)
        uses cookies and similar technologies on zentronsolutions.com.
      </p>

      <LegalSection title="What cookies are">
        <p>
          Cookies are small text files stored on your device. We also use
          similar technologies such as local storage for session management.
        </p>
      </LegalSection>

      <LegalSection title="Strictly necessary">
        <p>
          These are required for the platform to work. They include
          authentication session cookies (Supabase Auth), security tokens, and
          preferences needed to keep you signed in. Without them, core features
          such as sign-in and dashboard access will not function. Legal basis:
          legitimate interests / contract performance.
        </p>
      </LegalSection>

      <LegalSection title="Functional">
        <p>
          We may store lightweight preferences (e.g. UI state) to improve your
          experience. These are not used for advertising.
        </p>
      </LegalSection>

      <LegalSection title="Analytics">
        <p>
          We do not run third-party analytics cookies during early access. If
          we introduce analytics, we will update this page first and, where
          required, request consent before non-essential cookies are set.
        </p>
      </LegalSection>

      <LegalSection title="Marketing">
        <p>
          We do not use marketing or retargeting cookies at this time.
        </p>
      </LegalSection>

      <LegalSection title="Managing cookies">
        <p>
          You can block or delete cookies in your browser settings. Blocking
          strictly necessary cookies will sign you out and may prevent use of
          the platform. For more about how we handle personal data, see our{" "}
          <a
            href="/legal/privacy"
            className="font-medium text-ink hover:text-brand"
          >
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Cookie questions:{" "}
          <a
            href="mailto:privacy@zentronsolutions.com"
            className="font-medium text-ink hover:text-brand"
          >
            privacy@zentronsolutions.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
