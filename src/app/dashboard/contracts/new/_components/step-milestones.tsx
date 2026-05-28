"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, textareaClass } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import type {
  ContractMilestonesInput,
  MilestoneInput,
} from "@/lib/validations/contract";

type Props = {
  value: ContractMilestonesInput;
  totalFeeCents: number;
  currency: string;
  errors: Array<Partial<Record<keyof MilestoneInput, string>>>;
  onChange: (next: ContractMilestonesInput) => void;
};

const emptyRow: MilestoneInput = {
  title: "",
  description: "",
  amount_cents: 0,
  due_at: "",
};

function formatMoney(cents: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  const sign = cents < 0 ? "-" : "";
  return `${sign}${symbol}${(Math.abs(cents) / 100).toLocaleString("en-GB", {
    maximumFractionDigits: 0,
  })}`;
}

export function StepMilestones({
  value,
  totalFeeCents,
  currency,
  errors,
  onChange,
}: Props) {
  const sum = value.milestones.reduce((s, m) => s + (m.amount_cents || 0), 0);
  const diff = totalFeeCents - sum;
  const ok = diff === 0;

  const updateRow = (i: number, next: Partial<MilestoneInput>) => {
    onChange({
      milestones: value.milestones.map((m, idx) =>
        idx === i ? { ...m, ...next } : m,
      ),
    });
  };
  const removeRow = (i: number) => {
    if (value.milestones.length === 1) return;
    onChange({ milestones: value.milestones.filter((_, idx) => idx !== i) });
  };
  const addRow = () => {
    if (value.milestones.length >= 20) return;
    onChange({ milestones: [...value.milestones, emptyRow] });
  };
  const splitEvenly = () => {
    const n = value.milestones.length;
    if (n === 0) return;
    const per = Math.floor(totalFeeCents / n);
    const remainder = totalFeeCents - per * n;
    onChange({
      milestones: value.milestones.map((m, i) => ({
        ...m,
        amount_cents: i === n - 1 ? per + remainder : per,
      })),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        className={cn(
          "flex flex-wrap items-baseline justify-between gap-2 rounded-xl px-4 py-3 ring-1 transition-colors",
          ok
            ? "bg-brand/10 text-brand ring-brand/30"
            : "bg-destructive/10 text-destructive ring-destructive/30",
        )}
      >
        <div className="flex flex-col">
          <p className="text-[11px] uppercase tracking-[0.18em]">
            Milestones sum
          </p>
          <p className="font-display text-xl tabular-nums text-ink">
            {formatMoney(sum, currency)}{" "}
            <span className="text-sm text-muted-foreground">
              of {formatMoney(totalFeeCents, currency)}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {ok ? (
            <p className="text-xs font-medium uppercase tracking-[0.14em]">
              Matches total
            </p>
          ) : (
            <p className="text-xs font-medium uppercase tracking-[0.14em]">
              {diff > 0 ? `${formatMoney(diff, currency)} unallocated` : `${formatMoney(-diff, currency)} over`}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={splitEvenly}
            disabled={value.milestones.length === 0 || totalFeeCents === 0}
          >
            Split evenly
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {value.milestones.map((row, i) => {
          const rowErrors = errors[i] ?? {};
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl border border-border bg-card p-4"
            >
              <span
                aria-hidden
                className="absolute inset-x-4 top-0 h-px bg-brand"
              />
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
                  M{String(i + 1).padStart(2, "0")}
                </p>
                {value.milestones.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-[1.2fr_140px_160px]">
                <Field
                  label="Title"
                  htmlFor={`m-title-${i}`}
                  error={rowErrors.title}
                >
                  <Input
                    id={`m-title-${i}`}
                    value={row.title}
                    onChange={(e) =>
                      updateRow(i, { title: e.target.value })
                    }
                    placeholder="Deliverable 1 — Reels x3"
                  />
                </Field>
                <Field
                  label="Amount (cents)"
                  htmlFor={`m-amount-${i}`}
                  error={rowErrors.amount_cents}
                >
                  <Input
                    id={`m-amount-${i}`}
                    type="number"
                    min={0}
                    value={row.amount_cents}
                    onChange={(e) =>
                      updateRow(i, {
                        amount_cents: Number(e.target.value) || 0,
                      })
                    }
                  />
                </Field>
                <Field
                  label="Due date"
                  htmlFor={`m-due-${i}`}
                  error={rowErrors.due_at}
                >
                  <Input
                    id={`m-due-${i}`}
                    type="date"
                    value={row.due_at ?? ""}
                    onChange={(e) =>
                      updateRow(i, { due_at: e.target.value })
                    }
                  />
                </Field>
              </div>

              <div className="mt-3">
                <textarea
                  value={row.description ?? ""}
                  onChange={(e) =>
                    updateRow(i, { description: e.target.value })
                  }
                  placeholder="Optional notes for this milestone"
                  maxLength={1000}
                  className={textareaClass}
                  rows={2}
                />
              </div>
            </div>
          );
        })}
      </div>

      {value.milestones.length < 20 ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          className="self-start"
        >
          <Plus className="size-3.5" />
          Add milestone
        </Button>
      ) : null}
    </div>
  );
}
