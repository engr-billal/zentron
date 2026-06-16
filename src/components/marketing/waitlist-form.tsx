"use client";

import { useActionState, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  joinWaitlist,
  type WaitlistActionState,
} from "@/app/_actions/waitlist.actions";

const ROLE_OPTIONS = [
  { value: "either", label: "Exploring" },
  { value: "brand", label: "Brand" },
  { value: "creator", label: "Creator" },
] as const;

export function WaitlistForm({
  source,
  variant = "light",
}: {
  source?: string;
  variant?: "light" | "dark";
}) {
  const [roleIntent, setRoleIntent] =
    useState<(typeof ROLE_OPTIONS)[number]["value"]>("either");
  const [state, formAction, pending] = useActionState<
    WaitlistActionState,
    FormData
  >(joinWaitlist, null);

  const isDark = variant === "dark";

  if (state && "success" in state) {
    return (
      <div
        role="status"
        className={cn(
          "flex flex-col gap-2 rounded-2xl border px-5 py-4",
          isDark
            ? "border-paper/20 bg-paper/5 text-paper"
            : "border-brand/30 bg-brand/10 text-brand",
        )}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <Check className="size-4 shrink-0" />
          <span>You&apos;re on the list.</span>
        </div>
        <p
          className={cn(
            "text-sm",
            isDark ? "text-paper/70" : "text-brand/90",
          )}
        >
          We&apos;ll email you once there&apos;s capacity on your side. No
          spam — one message when it&apos;s your turn.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex w-full max-w-md flex-col gap-3">
      <input type="hidden" name="source" value={source ?? "landing"} />
      <input type="hidden" name="role_intent" value={roleIntent} />
      <div className="flex flex-wrap gap-2">
        {ROLE_OPTIONS.map((opt) => {
          const active = roleIntent === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRoleIntent(opt.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors",
                active
                  ? "border-brand bg-brand text-brand-foreground"
                  : isDark
                    ? "border-paper/25 text-paper/70 hover:border-paper/50"
                    : "border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-ink",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <div className="flex items-stretch gap-0 overflow-hidden rounded-full border border-border bg-card focus-within:border-brand">
        <input
          type="email"
          name="email"
          required
          placeholder="you@company.com"
          className={cn(
            "flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground",
            isDark ? "text-paper" : "text-ink",
          )}
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90 disabled:opacity-60"
        >
          {pending ? "Joining..." : "Join waitlist"}
          <ArrowUpRight className="size-3.5" />
        </button>
      </div>
      {state && "error" in state && state.error ? (
        <p
          role="alert"
          className={cn(
            "text-xs",
            isDark ? "text-destructive/90" : "text-destructive",
          )}
        >
          {state.error}
        </p>
      ) : (
        <p
          className={cn(
            "px-1 text-xs",
            isDark ? "text-paper/50" : "text-muted-foreground",
          )}
        >
          Pick a role so we know which cohort to prioritise.
        </p>
      )}
    </form>
  );
}
