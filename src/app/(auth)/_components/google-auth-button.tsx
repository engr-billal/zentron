"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "../_actions/auth.actions";

type Props = {
  label: string;
  disabled?: boolean;
  disabledHint?: string;
};

export function GoogleAuthButton({ label, disabled, disabledHint }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        disabled={pending || disabled}
        title={disabled ? disabledHint : undefined}
        onClick={() => {
          startTransition(async () => {
            await signInWithGoogle();
          });
        }}
      >
        <GoogleMark />
        {pending ? "Connecting..." : label}
      </Button>
      {disabled && disabledHint ? (
        <p className="text-xs text-muted-foreground">{disabledHint}</p>
      ) : null}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 18 18"
      className="size-4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.79 2.72v2.27h2.9c1.7-1.57 2.69-3.88 2.69-6.64Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.46-.81 5.95-2.18l-2.9-2.27c-.8.54-1.83.86-3.05.86a5.27 5.27 0 0 1-4.95-3.65H1.05v2.29A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M4.05 10.76A5.4 5.4 0 0 1 3.78 9c0-.61.1-1.21.27-1.76V4.95H1.05A9 9 0 0 0 0 9c0 1.46.34 2.84 1.05 4.05l3-2.29Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.43 1.34l2.57-2.57A9 9 0 0 0 9 0a9 9 0 0 0-7.95 4.95l3 2.29A5.27 5.27 0 0 1 9 3.58Z"
      />
    </svg>
  );
}
