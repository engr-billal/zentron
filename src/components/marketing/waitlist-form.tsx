"use client";

import { useActionState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  joinWaitlist,
  type WaitlistActionState,
} from "@/app/_actions/waitlist.actions";

export function WaitlistForm({
  source,
  variant = "light",
}: {
  source?: string;
  variant?: "light" | "dark";
}) {
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
          "flex items-center gap-2 rounded-full border px-4 py-2 text-sm",
          isDark
            ? "border-paper/20 bg-paper/5 text-paper"
            : "border-brand/30 bg-brand/10 text-brand",
        )}
      >
        <Check className="size-4" />
        <span>You&apos;re on the list — we&apos;ll be in touch.</span>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex w-full max-w-md flex-col gap-2">
      <input type="hidden" name="source" value={source ?? "landing"} />
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
        <select
          name="role_intent"
          defaultValue="either"
          className={cn(
            "border-l border-border bg-transparent px-2 text-xs outline-none",
            isDark ? "text-paper/70" : "text-muted-foreground",
          )}
          aria-label="Role"
        >
          <option value="either">I&apos;m exploring</option>
          <option value="brand">I&apos;m a brand</option>
          <option value="creator">I&apos;m a creator</option>
        </select>
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
            "px-2 text-xs",
            isDark ? "text-paper/50" : "text-muted-foreground",
          )}
        >
          No spam. We&apos;ll send a single email when your side opens up.
        </p>
      )}
    </form>
  );
}
