"use client";

import { useState, useTransition } from "react";
import { Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBriefShareLink } from "../../_actions/share-link.actions";

export function BriefShareLink({ briefId }: { briefId: string }) {
  const [pending, startTransition] = useTransition();
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-ink">
        <Link2 className="size-4 text-brand" />
        Invite by link
      </div>
      <p className="text-xs text-muted-foreground">
        Generate a one-time link for a creator. Expires in 7 days.
      </p>
      {url ? (
        <div className="flex flex-col gap-2">
          <code className="break-all rounded-md bg-surface px-2 py-1 text-xs text-ink">
            {url}
          </code>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={async () => {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            <Copy className="size-3.5" />
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          disabled={pending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await createBriefShareLink(briefId);
              if (result && "error" in result) {
                setError(result.error);
                return;
              }
              if (result && "success" in result) setUrl(result.url);
            });
          }}
        >
          {pending ? "Generating..." : "Generate invite link"}
        </Button>
      )}
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
