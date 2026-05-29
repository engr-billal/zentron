"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/shared/step-indicator";
import {
  completeBrandOnboardingSchema,
  type BrandBillingInput,
  type BrandCompanyInput,
  type BrandTargetingInput,
  type CompleteBrandOnboardingInput,
} from "@/lib/validations/brand";
import { StepCompany } from "./step-company";
import { StepTargeting } from "./step-targeting";
import { StepBilling } from "./step-billing";
import {
  completeBrandOnboarding,
  type BrandActionState,
} from "../_actions/brand.actions";

const STEP_LABELS = ["Company", "Targeting", "Invoicing"];

const initial: CompleteBrandOnboardingInput = {
  company: {
    company_name: "",
    website: "",
    industry: "D2C",
    team_size: "1-10",
  },
  targeting: {
    default_niches: [],
    default_platforms: [],
    default_audience_bands: [],
  },
  billing: { billing_country: "GB", currency: "USD" },
};

type StepErrors = {
  company?: Partial<Record<keyof BrandCompanyInput, string>>;
  targeting?: Partial<Record<keyof BrandTargetingInput, string>>;
  billing?: Partial<Record<keyof BrandBillingInput, string>>;
};

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [payload, setPayload] = useState(initial);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [state, formAction, pending] = useActionState<
    BrandActionState,
    CompleteBrandOnboardingInput
  >(submitAction, null);

  async function submitAction(
    _prev: BrandActionState,
    input: CompleteBrandOnboardingInput,
  ): Promise<BrandActionState> {
    return completeBrandOnboarding(input);
  }

  const validateStep = (current: number): boolean => {
    if (current === 0) {
      const result = completeBrandOnboardingSchema.shape.company.safeParse(
        payload.company,
      );
      if (!result.success) {
        const errs: Partial<Record<keyof BrandCompanyInput, string>> = {};
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof BrandCompanyInput | undefined;
          if (key) errs[key] = issue.message;
        }
        setStepErrors({ company: errs });
        return false;
      }
    }
    if (current === 1) {
      const result = completeBrandOnboardingSchema.shape.targeting.safeParse(
        payload.targeting,
      );
      if (!result.success) {
        const errs: Partial<Record<keyof BrandTargetingInput, string>> = {};
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof BrandTargetingInput | undefined;
          if (key) errs[key] = issue.message;
        }
        setStepErrors({ targeting: errs });
        return false;
      }
    }
    if (current === 2) {
      const result = completeBrandOnboardingSchema.shape.billing.safeParse(
        payload.billing,
      );
      if (!result.success) {
        const errs: Partial<Record<keyof BrandBillingInput, string>> = {};
        for (const issue of result.error.issues) {
          const key = issue.path[0] as keyof BrandBillingInput | undefined;
          if (key) errs[key] = issue.message;
        }
        setStepErrors({ billing: errs });
        return false;
      }
    }
    setStepErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(2, s + 1));
  };
  const handleBack = () => {
    setStepErrors({});
    setStep((s) => Math.max(0, s - 1));
  };
  const handleSubmit = () => {
    if (!validateStep(2)) return;
    return formAction(payload);
  };

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator step={step} total={3} labels={STEP_LABELS} />

      <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_24px_60px_-24px_oklch(0.18_0.01_60_/_0.12)]">
        <h2 className="font-display text-2xl text-ink">
          {step === 0 ? (
            <>
              About your <span className="italic text-brand">company.</span>
            </>
          ) : step === 1 ? (
            <>
              Who you typically <span className="italic text-brand">work with.</span>
            </>
          ) : (
            <>
              Invoicing <span className="italic text-brand">setup.</span>
            </>
          )}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {step === 0
            ? "Name and basics. Visible to creators when you invite them to briefs."
            : step === 1
              ? "Sets sensible defaults on every new brief. Override per-brief anytime."
              : "Used for invoices and tax region. You can change this anytime in settings."}
        </p>

        <div className="mt-6">
          {step === 0 ? (
            <StepCompany
              value={payload.company}
              errors={stepErrors.company ?? {}}
              onChange={(company) => setPayload({ ...payload, company })}
            />
          ) : step === 1 ? (
            <StepTargeting
              value={payload.targeting}
              errors={stepErrors.targeting ?? {}}
              onChange={(targeting) => setPayload({ ...payload, targeting })}
            />
          ) : (
            <StepBilling
              value={payload.billing}
              errors={stepErrors.billing ?? {}}
              onChange={(billing) => setPayload({ ...payload, billing })}
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
            <Button
              type="button"
              variant="brand"
              size="lg"
              onClick={handleSubmit}
              disabled={pending}
            >
              {pending ? "Setting up..." : "Finish & start a brief"}
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
