"use client";

import { useActionState, useState } from "react";
import { Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ActionState } from "../../_actions/auth.actions";

type RoleValue = "brand" | "creator";

type Option = {
  value: RoleValue;
  label: string;
  blurb: string;
};

const ICONS: Record<RoleValue, React.ComponentType<{ className?: string }>> = {
  brand: Briefcase,
  creator: Sparkles,
};

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  options: Option[];
  defaultRole?: RoleValue;
};

export function RoleSelectForm({ action, options, defaultRole }: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    null,
  );
  const [selected, setSelected] = useState<RoleValue | null>(
    defaultRole ?? null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-3">
        {options.map((opt) => {
          const isActive = selected === opt.value;
          const Icon = ICONS[opt.value];
          return (
            <label
              key={opt.value}
              className={cn(
                "group relative flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 transition-all",
                isActive
                  ? "border-brand/60 ring-2 ring-brand/20"
                  : "border-border hover:border-brand/40",
              )}
            >
              <input
                type="radio"
                name="role"
                value={opt.value}
                checked={isActive}
                onChange={() => setSelected(opt.value)}
                className="sr-only"
                required
              />
              <span
                className={cn(
                  "inline-flex size-9 shrink-0 items-center justify-center rounded-lg ring-1 transition-colors",
                  isActive
                    ? "bg-brand/10 text-brand ring-brand/30"
                    : "bg-surface text-ink ring-border",
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-medium text-ink">{opt.label}</span>
                <span className="text-sm text-muted-foreground">
                  {opt.blurb}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      {state?.error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}
      <Button
        type="submit"
        variant="brand"
        size="lg"
        disabled={pending || !selected}
      >
        {pending ? "Setting up..." : "Continue"}
      </Button>
    </form>
  );
}
