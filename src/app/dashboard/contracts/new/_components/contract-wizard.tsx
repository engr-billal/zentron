"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/shared/step-indicator";
import {
  completeContractSchema,
  type CompleteContractInput,
  type ContractScheduleInput,
  type ContractScopeInput,
  type ContractTermsInput,
  type MilestoneInput,
} from "@/lib/validations/contract";
import { StepScope } from "./step-scope";
import { StepSchedule } from "./step-schedule";
import { StepMilestones } from "./step-milestones";
import { StepTerms } from "./step-terms";
import {
  createContract,
  updateContract,
  type ContractActionState,
} from "../_actions/contract.actions";

const STEP_LABELS = ["Scope", "Schedule", "Milestones", "Terms"];

type Mode = { kind: "new" } | { kind: "edit"; contractId: string };

type StepErrors = {
  scope?: Partial<Record<keyof ContractScopeInput, string>>;
  schedule?: Partial<Record<keyof ContractScheduleInput, string>>;
  milestones?: Array<Partial<Record<keyof MilestoneInput, string>>>;
  milestonesSum?: string;
  terms?: Partial<Record<keyof ContractTermsInput, string>>;
};

export function ContractWizard({
  mode,
  initial,
}: {
  mode: Mode;
  initial: CompleteContractInput;
}) {
  const [step, setStep] = useState(0);
  const [payload, setPayload] = useState<CompleteContractInput>(initial);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});

  const submitAction = async (
    _prev: ContractActionState,
    input: CompleteContractInput,
  ): Promise<ContractActionState> => {
    if (mode.kind === "edit") return updateContract(mode.contractId, input);
    return createContract(input);
  };

  const [state, formAction, pending] = useActionState<
    ContractActionState,
    CompleteContractInput
  >(submitAction, null);

  const validateStep = (current: number): boolean => {
    if (current === 0) {
      const result = completeContractSchema.shape.scope.safeParse(
        payload.scope,
      );
      if (!result.success) {
        const errs: Partial<Record<keyof ContractScopeInput, string>> = {};
        for (const issue of result.error.issues) {
          const k = issue.path[0] as keyof ContractScopeInput | undefined;
          if (k) errs[k] = issue.message;
        }
        setStepErrors({ scope: errs });
        return false;
      }
    }
    if (current === 1) {
      const result = completeContractSchema.shape.schedule.safeParse(
        payload.schedule,
      );
      if (!result.success) {
        const errs: Partial<Record<keyof ContractScheduleInput, string>> = {};
        for (const issue of result.error.issues) {
          const k = issue.path[0] as keyof ContractScheduleInput | undefined;
          if (k) errs[k] = issue.message;
        }
        setStepErrors({ schedule: errs });
        return false;
      }
    }
    if (current === 2) {
      const result = completeContractSchema.shape.milestones.safeParse(
        payload.milestones,
      );
      if (!result.success) {
        const errs: Array<Partial<Record<keyof MilestoneInput, string>>> =
          payload.milestones.milestones.map(() => ({}));
        for (const issue of result.error.issues) {
          const idx = issue.path[1] as number | undefined;
          const key = issue.path[2] as keyof MilestoneInput | undefined;
          if (typeof idx === "number" && key) {
            errs[idx] = { ...errs[idx], [key]: issue.message };
          }
        }
        setStepErrors({ milestones: errs });
        return false;
      }
      const sum = payload.milestones.milestones.reduce(
        (s, m) => s + m.amount_cents,
        0,
      );
      if (sum !== payload.schedule.total_fee_cents) {
        setStepErrors({
          milestonesSum: "Milestone amounts must add up to the total fee",
        });
        return false;
      }
    }
    if (current === 3) {
      const result = completeContractSchema.shape.terms.safeParse(payload.terms);
      if (!result.success) {
        const errs: Partial<Record<keyof ContractTermsInput, string>> = {};
        for (const issue of result.error.issues) {
          const k = issue.path[0] as keyof ContractTermsInput | undefined;
          if (k) errs[k] = issue.message;
        }
        setStepErrors({ terms: errs });
        return false;
      }
    }
    setStepErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
  };
  const handleBack = () => {
    setStepErrors({});
    setStep((s) => Math.max(0, s - 1));
  };
  const handleSubmit = () => {
    if (!validateStep(3)) return;
    return formAction(payload);
  };

  return (
    <div className="flex flex-col gap-8">
      <StepIndicator step={step} total={4} labels={STEP_LABELS} />

      <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_24px_60px_-24px_oklch(0.18_0.01_60_/_0.12)]">
        <h2 className="font-display text-2xl text-ink">
          {step === 0 ? (
            <>
              The <span className="italic text-brand">scope.</span>
            </>
          ) : step === 1 ? (
            <>
              Schedule & <span className="italic text-brand">fee.</span>
            </>
          ) : step === 2 ? (
            <>
              <span className="italic text-brand">Milestones.</span>
            </>
          ) : (
            <>
              The <span className="italic text-brand">terms.</span>
            </>
          )}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {step === 0
            ? "Title and a clear scope of what the creator will deliver."
            : step === 1
              ? "Total fee in cents (so $500 = 50000). Dates optional."
              : step === 2
                ? "Split the fee across milestones. The sum must equal the total fee."
                : "Exclusivity and usage rights. Optional but worth documenting."}
        </p>

        <div className="mt-6">
          {step === 0 ? (
            <StepScope
              value={payload.scope}
              errors={stepErrors.scope ?? {}}
              onChange={(scope) => setPayload({ ...payload, scope })}
            />
          ) : step === 1 ? (
            <StepSchedule
              value={payload.schedule}
              errors={stepErrors.schedule ?? {}}
              onChange={(schedule) => setPayload({ ...payload, schedule })}
            />
          ) : step === 2 ? (
            <StepMilestones
              value={payload.milestones}
              totalFeeCents={payload.schedule.total_fee_cents}
              currency={payload.schedule.currency}
              errors={stepErrors.milestones ?? []}
              onChange={(milestones) => setPayload({ ...payload, milestones })}
            />
          ) : (
            <StepTerms
              value={payload.terms}
              errors={stepErrors.terms ?? {}}
              onChange={(terms) => setPayload({ ...payload, terms })}
            />
          )}
        </div>

        {stepErrors.milestonesSum ? (
          <p
            role="alert"
            className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {stepErrors.milestonesSum}
          </p>
        ) : null}

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
          {step < 3 ? (
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
                  ? "Save changes"
                  : "Create draft"}
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
