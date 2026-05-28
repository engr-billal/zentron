"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  selectClass,
} from "@/app/onboarding/creator/_components/form-field";
import {
  CREATOR_PLATFORM_TYPES,
  PLATFORM_LABELS,
} from "@/lib/constants/creator";
import {
  addPlatform,
  updatePlatform,
  type PlatformActionState,
} from "../_actions/platform.actions";
import type { Tables } from "@/types/database";

type Platform = Tables<"creator_platforms">;

type Props =
  | { mode: "add"; onDone: () => void }
  | { mode: "edit"; row: Platform; onDone: () => void };

export function PlatformForm(props: Props) {
  const editAction = async (
    prev: PlatformActionState,
    formData: FormData,
  ): Promise<PlatformActionState> => {
    if (props.mode !== "edit") return null;
    const result = await updatePlatform(props.row.id, prev, formData);
    if (result === null) props.onDone();
    return result;
  };

  const addAction = async (
    prev: PlatformActionState,
    formData: FormData,
  ): Promise<PlatformActionState> => {
    if (props.mode !== "add") return null;
    const result = await addPlatform(prev, formData);
    if (result === null) props.onDone();
    return result;
  };

  const action = props.mode === "edit" ? editAction : addAction;
  const initial: Partial<Platform> = props.mode === "edit" ? props.row : {};

  const [state, formAction, pending] = useActionState<PlatformActionState, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Platform" htmlFor="platform">
          <select
            id="platform"
            name="platform"
            defaultValue={initial.platform ?? "instagram"}
            disabled={props.mode === "edit"}
            className={selectClass}
            required
          >
            {CREATOR_PLATFORM_TYPES.map((p) => (
              <option key={p} value={p}>
                {PLATFORM_LABELS[p]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Handle" htmlFor="handle">
          <Input
            id="handle"
            name="handle"
            defaultValue={initial.handle ?? ""}
            required
          />
        </Field>
        <Field label="Followers" htmlFor="followers">
          <Input
            id="followers"
            name="followers"
            type="number"
            min={0}
            defaultValue={initial.followers ?? 0}
          />
        </Field>
        <Field
          label="Avg engagement rate"
          htmlFor="avg_engagement_rate"
          hint="0–1 (e.g. 0.038 = 3.8%)."
        >
          <Input
            id="avg_engagement_rate"
            name="avg_engagement_rate"
            type="number"
            min={0}
            max={1}
            step={0.001}
            defaultValue={initial.avg_engagement_rate ?? 0.02}
          />
        </Field>
        <Field
          label="Audience health (0–100)"
          htmlFor="audience_health_score"
          className="sm:col-span-2"
        >
          <Input
            id="audience_health_score"
            name="audience_health_score"
            type="number"
            min={0}
            max={100}
            defaultValue={initial.audience_health_score ?? 80}
          />
        </Field>
      </div>

      {state?.error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={props.onDone}
          disabled={pending}
        >
          Cancel
        </Button>
        <Button type="submit" variant="brand" size="sm" disabled={pending}>
          {pending
            ? "Saving..."
            : props.mode === "edit"
              ? "Save changes"
              : "Add platform"}
        </Button>
      </div>
    </form>
  );
}
