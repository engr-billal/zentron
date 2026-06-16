"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/shared/field";
import {
  submitContactMessage,
  type ContactActionState,
} from "@/app/_actions/contact.actions";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<
    ContactActionState,
    FormData
  >(submitContactMessage, null);

  if (state && "success" in state) {
    return (
      <p role="status" className="text-sm text-brand">
        Message sent. We&apos;ll reply to your email within a couple of working
        days.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <Field label="Name" htmlFor="name">
        <Input id="name" name="name" required maxLength={100} />
      </Field>
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" required />
      </Field>
      <Field label="Message" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={2000}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </Field>
      {state && "error" in state ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" variant="brand" size="sm" disabled={pending}>
        {pending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
