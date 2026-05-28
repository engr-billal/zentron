import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BriefDeliverableInput } from "@/lib/validations/brief";
import { DELIVERABLE_LABELS, type DeliverableType } from "@/lib/constants/brand";
import type { CompleteContractInput } from "@/lib/validations/contract";
import { ContractWizard } from "./_components/contract-wizard";

export const metadata = { title: "New contract" };

function scopeFromBrief(
  title: string,
  objective: string | null,
  deliverables: BriefDeliverableInput[],
): string {
  const lines: string[] = [];
  if (objective) {
    lines.push(`Objective: ${objective}`);
    lines.push("");
  }
  lines.push("Deliverables:");
  for (const d of deliverables) {
    const label = DELIVERABLE_LABELS[d.type as DeliverableType] ?? d.type;
    lines.push(`- ${label} × ${d.count}${d.specs ? ` — ${d.specs}` : ""}`);
  }
  return lines.join("\n");
}

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: Promise<{ brief?: string; creator?: string }>;
}) {
  const { brief: briefId, creator: creatorId } = await searchParams;
  if (!briefId || !creatorId) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: brief } = await supabase
    .from("briefs")
    .select("*")
    .eq("id", briefId)
    .maybeSingle();
  if (!brief) notFound();
  if (brief.brand_id !== user.id) redirect("/dashboard");

  const { data: invitation } = await supabase
    .from("brief_invitations")
    .select("status")
    .eq("brief_id", briefId)
    .eq("creator_id", creatorId)
    .maybeSingle();
  if (!invitation || invitation.status !== "opted_in") {
    redirect(`/dashboard/briefs/${briefId}`);
  }

  const { data: creatorRow } = await supabase
    .from("creator_profiles")
    .select("handle")
    .eq("id", creatorId)
    .maybeSingle();

  const totalFeeDefault =
    brief.budget_max_cents ?? brief.budget_min_cents ?? 0;
  const deliverables =
    (brief.deliverables as unknown as BriefDeliverableInput[]) ?? [];

  const initial: CompleteContractInput = {
    brief_id: briefId,
    creator_id: creatorId,
    scope: {
      title: brief.title,
      scope: scopeFromBrief(brief.title, brief.objective, deliverables),
    },
    schedule: {
      total_fee_cents: totalFeeDefault,
      currency:
        (brief.currency as CompleteContractInput["schedule"]["currency"]) ??
        "USD",
      start_date: "",
      end_date: "",
    },
    milestones: {
      milestones: [
        {
          title: "Full delivery",
          description: "",
          amount_cents: totalFeeDefault,
          due_at: "",
        },
      ],
    },
    terms: {
      exclusivity: brief.exclusivity ?? "",
      usage_rights: brief.usage_rights ?? "",
    },
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        New contract
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
        Draft for{" "}
        <span className="italic text-brand">
          @{creatorRow?.handle ?? "creator"}
        </span>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Based on the brief &quot;{brief.title}&quot;. Edit any field; send when
        ready and the creator will be asked to sign.
      </p>

      <div className="mt-8">
        <ContractWizard mode={{ kind: "new" }} initial={initial} />
      </div>
    </section>
  );
}
