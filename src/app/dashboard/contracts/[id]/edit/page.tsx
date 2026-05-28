import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CompleteContractInput } from "@/lib/validations/contract";
import { ContractWizard } from "../../new/_components/contract-wizard";

export const metadata = { title: "Edit contract" };

export default async function EditContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: contract } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!contract) notFound();
  if (contract.brand_id !== user.id) redirect("/dashboard");
  if (contract.status !== "draft") redirect(`/dashboard/contracts/${id}`);

  const { data: milestones } = await supabase
    .from("milestones")
    .select("*")
    .eq("contract_id", id)
    .order("sequence", { ascending: true });

  const initial: CompleteContractInput = {
    brief_id: contract.brief_id,
    creator_id: contract.creator_id,
    scope: {
      title: contract.title,
      scope: contract.scope,
    },
    schedule: {
      total_fee_cents: contract.total_fee_cents,
      currency:
        (contract.currency as CompleteContractInput["schedule"]["currency"]) ??
        "USD",
      start_date: contract.start_date ?? "",
      end_date: contract.end_date ?? "",
    },
    milestones: {
      milestones: (milestones ?? []).map((m) => ({
        title: m.title,
        description: m.description ?? "",
        amount_cents: m.amount_cents,
        due_at: m.due_at ?? "",
      })),
    },
    terms: {
      exclusivity: contract.exclusivity ?? "",
      usage_rights: contract.usage_rights ?? "",
    },
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        Edit contract
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
        {contract.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Drafts can be edited freely. Once sent the contract is locked.
      </p>

      <div className="mt-8">
        <ContractWizard
          mode={{ kind: "edit", contractId: contract.id }}
          initial={initial}
        />
      </div>
    </section>
  );
}
