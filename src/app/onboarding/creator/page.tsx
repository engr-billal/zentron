import { OnboardingWizard } from "./_components/onboarding-wizard";

export const metadata = { title: "Finish your creator profile" };

export default function OnboardingCreatorPage() {
  return (
    <div className="pt-2">
      <p className="font-display text-3xl text-ink sm:text-4xl">
        Build your <span className="italic text-brand">Zentron Score.</span>
      </p>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Three quick steps — identity, work, platforms. We&apos;ll compute your
        Score the moment you finish.
      </p>

      <div className="mt-8">
        <OnboardingWizard />
      </div>
    </div>
  );
}
