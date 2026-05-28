"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  completeCreatorOnboardingSchema,
  type CompleteCreatorOnboardingInput,
  type CreatorIdentityInput,
  type CreatorPlatformInput,
  type CreatorWorkInput,
} from "@/lib/validations/creator";
import { StepIndicator } from "./step-indicator";
import { StepIdentity } from "./step-identity";
import { StepWork } from "./step-work";
import { StepPlatforms } from "./step-platforms";
import {
  completeCreatorOnboarding,
  type CreatorActionState,
} from "../_actions/creator.actions";

const STEP_LABELS = ["You", "Your work", "Your platforms"];

const initial: CompleteCreatorOnboardingInput = {
  identity: { handle: "", country: "GB", languages: ["en"], bio: "" },
  work: {
    niches: [],
    primary_platform: "instagram",
    currency: "USD",
    base_rate_cents: undefined,
  },
  platforms: [
    {
      platform: "instagram",
      handle: "",
      followers: 0,
      avg_engagement_rate: 0.02,
      audience_health_score: 80,
      verified: false,
    },
  ],
};

type StepErrors = {
  identity?: Partial<Record<keyof CreatorIdentityInput, string>>;
  work?: Partial<Record<keyof CreatorWorkInput, string>>;
  platforms?: Array<Partial<Record<keyof CreatorPlatformInput, string>>>;
};

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [payload, setPayload] = useState(initial);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [state, formAction, pending] = useActionState<
    CreatorActionState,
    CompleteCreatorOnboardingInput
  >(submitAction, null);

  async function submitAction(
    _prev: CreatorActionState,
    input: CompleteCreatorOnboardingInput,
  ): Promise<CreatorActionState> {
    return completeCreatorOnboarding(input);
  }

  const validateStep = (current: number): boolean => {
    if (current === 0) {
      const result = completeCreatorOnboardingSchema.shape.identity.safeParse(
        payload.identity,
      );
      if (!result.success) {
        const errs: Partial<Record<keyof CreatorIdentityInput, string>> = {};
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof CreatorIdentityInput | undefined;
          if (key) errs[key] = issue.message;
        }
        setStepErrors({ identity: errs });
        return false;
      }
    }
    if (current === 1) {
      const result = completeCreatorOnboardingSchema.shape.work.safeParse(
        payload.work,
      );
      if (!result.success) {
        const errs: Partial<Record<keyof CreatorWorkInput, string>> = {};
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof CreatorWorkInput | undefined;
          if (key) errs[key] = issue.message;
        }
        setStepErrors({ work: errs });
        return false;
      }
    }
    if (current === 2) {
      const result = completeCreatorOnboardingSchema.shape.platforms.safeParse(
        payload.platforms,
      );
      if (!result.success) {
        const errs: Array<Partial<Record<keyof CreatorPlatformInput, string>>> =
          payload.platforms.map(() => ({}));
        for (const issue of result.error.issues) {
          const idx = issue.path[0] as number | undefined;
          const key = issue.path[1] as
            | keyof CreatorPlatformInput
            | undefined;
          if (typeof idx === "number" && key) {
            errs[idx] = { ...errs[idx], [key]: issue.message };
          }
        }
        setStepErrors({ platforms: errs });
        return false;
      }
    }
    setStepErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(2, s + 1));
    }
  };

  const handleBack = () => {
    setStepErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const handleSubmit = (formData: FormData) => {
    if (!validateStep(2)) return;
    formData.set("payload", JSON.stringify(payload));
    return formAction(payload);
  };

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator step={step} total={3} labels={STEP_LABELS} />

      <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_24px_60px_-24px_oklch(0.18_0.01_60_/_0.12)]">
        <h2 className="font-display text-2xl text-ink">
          {step === 0 ? (
            <>
              Tell us about <span className="italic text-brand">you.</span>
            </>
          ) : step === 1 ? (
            <>
              Your <span className="italic text-brand">work.</span>
            </>
          ) : (
            <>
              Where you <span className="italic text-brand">publish.</span>
            </>
          )}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {step === 0
            ? "We use this for your public profile and discovery filters."
            : step === 1
              ? "Niche and platform drive your Zentron Score's pricing multipliers."
              : "Add at least one platform. Add more later if needed."}
        </p>

        <div className="mt-6">
          {step === 0 ? (
            <StepIdentity
              value={payload.identity}
              errors={stepErrors.identity ?? {}}
              onChange={(identity) => setPayload({ ...payload, identity })}
            />
          ) : step === 1 ? (
            <StepWork
              value={payload.work}
              errors={stepErrors.work ?? {}}
              onChange={(work) => setPayload({ ...payload, work })}
            />
          ) : (
            <StepPlatforms
              value={payload.platforms}
              errors={stepErrors.platforms ?? []}
              onChange={(platforms) => setPayload({ ...payload, platforms })}
            />
          )}
        </div>

        {state?.error ? (
          <p
            role="alert"
            className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {state.error}
          </p>
        ) : null}

        <div className="mt-8 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
            disabled={step === 0 || pending}
          >
            <ArrowLeft className="size-3.5" />
            Back
          </Button>
          {step < 2 ? (
            <Button
              type="button"
              variant="brand"
              size="lg"
              onClick={handleNext}
            >
              Continue
              <ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <form action={handleSubmit}>
              <Button
                type="submit"
                variant="brand"
                size="lg"
                disabled={pending}
              >
                {pending ? "Setting up..." : "Finish & see my Score"}
                <ArrowRight className="size-3.5" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
