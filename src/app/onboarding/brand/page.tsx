import { OnboardingWizard } from "./_components/onboarding-wizard";

export const metadata = { title: "Finish your brand profile" };

export default function OnboardingBrandPage() {
  return (
    <div className="pt-2">
      <p className="font-display text-3xl text-ink sm:text-4xl">
        Set up your <span className="italic text-brand">brand.</span>
      </p>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Three quick steps. After this you can write your first brief and see
        which creators match it.
      </p>

      <div className="mt-8">
        <OnboardingWizard />
      </div>
    </div>
  );
}
