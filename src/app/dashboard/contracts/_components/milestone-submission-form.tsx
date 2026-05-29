"use client";

import { useState, useTransition } from "react";
import { Plus, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, textareaClass } from "@/components/shared/field";
import { submitMilestone } from "../_actions/milestone.actions";

export function MilestoneSubmissionForm({
  milestoneId,
  initialNotes,
  initialUrls,
  resubmit,
}: {
  milestoneId: string;
  initialNotes: string;
  initialUrls: string[];
  resubmit: boolean;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [urls, setUrls] = useState<string[]>(
    initialUrls.length > 0 ? initialUrls : [""],
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const updateUrl = (i: number, next: string) =>
    setUrls((prev) => prev.map((u, idx) => (idx === i ? next : u)));
  const removeUrl = (i: number) =>
    setUrls((prev) => (prev.length === 1 ? [""] : prev.filter((_, idx) => idx !== i)));
  const addUrl = () =>
    setUrls((prev) => (prev.length >= 10 ? prev : [...prev, ""]));

  const onSubmit = () => {
    setError(null);
    startTransition(async () => {
      const cleanUrls = urls.map((u) => u.trim()).filter((u) => u.length > 0);
      const result = await submitMilestone(milestoneId, {
        notes: notes.trim(),
        urls: cleanUrls,
      });
      if (result && "error" in result) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="mt-3 flex flex-col gap-3 rounded-lg border border-dashed border-brand/30 bg-brand/5 p-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-brand">
        {resubmit ? "Resubmit deliverable" : "Submit deliverable"}
      </p>

      <Field
        label="Notes for the brand"
        htmlFor={`notes-${milestoneId}`}
        hint="Describe what you delivered, where it was published, and any relevant context."
      >
        <textarea
          id={`notes-${milestoneId}`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={2000}
          rows={3}
          className={textareaClass}
          placeholder="3 Reels published this week, see links below..."
        />
      </Field>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-ink">Links</p>
        {urls.map((u, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              type="url"
              value={u}
              onChange={(e) => updateUrl(i, e.target.value)}
              placeholder="https://instagram.com/p/..."
            />
            {urls.length > 1 || u.length > 0 ? (
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-destructive"
                aria-label="Remove link"
              >
                <Trash2 className="size-3.5" />
              </button>
            ) : null}
          </div>
        ))}
        {urls.length < 10 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addUrl}
            className="self-start"
          >
            <Plus className="size-3.5" />
            Add link
          </Button>
        ) : null}
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      <Button
        type="button"
        variant="brand"
        size="sm"
        onClick={onSubmit}
        disabled={pending}
        className="self-start"
      >
        <Send className="size-3.5" />
        {pending ? "Submitting..." : resubmit ? "Resubmit for review" : "Send for review"}
      </Button>
    </div>
  );
}
