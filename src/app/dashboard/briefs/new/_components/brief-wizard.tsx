"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/shared/step-indicator";
import {
  completeBriefSchema,
  type BriefAudienceInput,
  type BriefBasicsInput,
  type BriefBudgetInput,
  type BriefDeliverablesInput,
  type BriefTermsInput,
  type CompleteBriefInput,
} from "@/lib/validations/brief";
import { StepBasics } from "./step-basics";
import { StepAudience } from "./step-audience";
import { StepDeliverables } from "./step-deliverables";
import { StepBudget } from "./step-budget";
import { StepTerms } from "./step-terms";
import {
  createBrief,
  updateBrief,
  type BriefActionState,
} from "../_actions/brief.actions";

const STEP_LABELS = ["Basics", "Audience", "Deliverables", "Budget", "Terms"];

type Mode = { kind: "new" } | { kind: "edit"; briefId: string };

type Defaults = {
  niches: string[];
  platforms: string[];
  audienceBands: BriefAudienceInput["audience_size_bands"];
  currency: BriefBudgetInput["currency"];
};

function defaultPayload(
  initial?: CompleteBriefInput,
  defaults?: Defaults,
): CompleteBriefInput {
  if (initial) return initial;
  return {
    basics: {
      title: "",
      objective: "",
      niche: (defaults?.niches[0] as BriefBasicsInput["niche"]) ?? "lifestyle",
    },
    audience: {
      countries: [],
      audience_size_bands: defaults?.audienceBands ?? [],
      interests: [],
    },
    deliverables: {
      platforms:
        (defaults?.platforms as BriefDeliverablesInput["platforms"]) ?? [],
      deliverables: [
        { type: "reel", count: 1, specs: "" },
      ],
    },
    budget: {
      currency: defaults?.currency ?? "USD",
    },
    terms: { exclusivity: "", usage_rights: "" },
  };
}

type StepErrors = {
  basics?: Partial<Record<keyof BriefBasicsInput, string>>;
  audience?: Partial<Record<keyof BriefAudienceInput, string>>;
  deliverables?: Partial<Record<keyof BriefDeliverablesInput, string>>;
  budget?: Partial<Record<keyof BriefBudgetInput, string>>;
  terms?: Partial<Record<keyof BriefTermsInput, string>>;
};

export function BriefWizard({
  mode,
  initial,
  defaults,
}: {
  mode: Mode;
  initial?: CompleteBriefInput;
  defaults?: Defaults;
}) {
  const [step, setStep] = useState(0);
  const [payload, setPayload] = useState<CompleteBriefInput>(() =>
    defaultPayload(initial, defaults),
  );
  const [stepErrors, setStepErrors] = useState<StepErrors>({});

  const submitAction = async (
    _prev: BriefActionState,
    input: CompleteBriefInput,
  ): Promise<BriefActionState> => {
    if (mode.kind === "edit") return updateBrief(mode.briefId, input);
    return createBrief(input);
  };

  const [state, formAction, pending] = useActionState<
    BriefActionState,
    CompleteBriefInput
  >(submitAction, null);

  const validateStep = (current: number): boolean => {
    const schemas = [
      completeBriefSchema.shape.basics,
      completeBriefSchema.shape.audience,
      completeBriefSchema.shape.deliverables,
      completeBriefSchema.shape.budget,
      completeBriefSchema.shape.terms,
    ] as const;
    const keys = [
      "basics",
      "audience",
      "deliverables",
      "budget",
      "terms",
    ] as const;

    const key = keys[current];
    const result = schemas[current].safeParse(payload[key]);
    if (result.success) {
      setStepErrors({});
      return true;
    }
    const errs: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const k = issue.path[0];
      if (typeof k === "string") errs[k] = issue.message;
    }
    setStepErrors({ [key]: errs });
    return false;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(4, s + 1));
  };
  const handleBack = () => {
    setStepErrors({});
    setStep((s) => Math.max(0, s - 1));
  };
  const handleSubmit = () => {
    if (!validateStep(4)) return;
    return formAction(payload);
  };

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator step={step} total={5} labels={STEP_LABELS} />

      <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_24px_60px_-24px_oklch(0.18_0.01_60_/_0.12)]">
        <h2 className="font-display text-2xl text-ink">
          {step === 0 ? (
            <>
              The <span className="italic text-brand">basics.</span>
            </>
          ) : step === 1 ? (
            <>
              Your <span className="italic text-brand">audience.</span>
            </>
          ) : step === 2 ? (
            <>
              What gets <span className="italic text-brand">made.</span>
            </>
          ) : step === 3 ? (
            <>
              The <span className="italic text-brand">budget.</span>
            </>
          ) : (
            <>
              The <span className="italic text-brand">terms.</span>
            </>
          )}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {step === 0
            ? "Give it a clear title and pick a primary niche."
            : step === 1
              ? "Where and to whom does this need to reach?"
              : step === 2
                ? "Which platforms and what deliverables."
                : step === 3
                  ? "Budget range in cents (so $500 = 50000)."
                  : "Exclusivity and usage rights. Optional but worth documenting."}
        </p>

        <div className="mt-6">
          {step === 0 ? (
            <StepBasics
              value={payload.basics}
              errors={stepErrors.basics ?? {}}
              onChange={(basics) => setPayload({ ...payload, basics })}
            />
          ) : step === 1 ? (
            <StepAudience
              value={payload.audience}
              errors={stepErrors.audience ?? {}}
              onChange={(audience) => setPayload({ ...payload, audience })}
            />
          ) : step === 2 ? (
            <StepDeliverables
              value={payload.deliverables}
              errors={stepErrors.deliverables ?? {}}
              onChange={(deliverables) =>
                setPayload({ ...payload, deliverables })
              }
            />
          ) : step === 3 ? (
            <StepBudget
              value={payload.budget}
              errors={stepErrors.budget ?? {}}
              onChange={(budget) => setPayload({ ...payload, budget })}
            />
          ) : (
            <StepTerms
              value={payload.terms}
              errors={stepErrors.terms ?? {}}
              onChange={(terms) => setPayload({ ...payload, terms })}
            />
          )}
        </div>

        {state && "error" in state ? (
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
          {step < 4 ? (
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
              {pending
                ? "Saving..."
                : mode.kind === "edit"
                  ? "Save brief"
                  : "Create brief"}
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
