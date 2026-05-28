import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  BriefDeliverableInput,
  BriefTargetAudienceJson,
  CompleteBriefInput,
} from "@/lib/validations/brief";
import { BriefWizard } from "../../new/_components/brief-wizard";

export const metadata = { title: "Edit brief" };

export default async function EditBriefPage({
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

  const { data: brief } = await supabase
    .from("briefs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!brief) notFound();
  if (brief.brand_id !== user.id) redirect("/dashboard");
  if (brief.status !== "draft") {
    // Once published or closed, editing is locked. Could allow later via a
    // version bump, but for v0 we keep drafts editable only.
    redirect(`/dashboard/briefs/${brief.id}`);
  }

  const ta = (brief.target_audience ?? {}) as Partial<BriefTargetAudienceJson>;
  const initial: CompleteBriefInput = {
    basics: {
      title: brief.title,
      objective: brief.objective ?? "",
      niche: (brief.niche as CompleteBriefInput["basics"]["niche"]) ?? "lifestyle",
    },
    audience: {
      countries: ta.countries ?? [],
      age_min: ta.age_min ?? undefined,
      age_max: ta.age_max ?? undefined,
      audience_size_bands: ta.audience_size_bands ?? [],
      interests: ta.interests ?? [],
    },
    deliverables: {
      platforms:
        brief.platforms as CompleteBriefInput["deliverables"]["platforms"],
      deliverables:
        (brief.deliverables as unknown as BriefDeliverableInput[]) ?? [],
    },
    budget: {
      budget_min_cents: brief.budget_min_cents ?? undefined,
      budget_max_cents: brief.budget_max_cents ?? undefined,
      currency:
        (brief.currency as CompleteBriefInput["budget"]["currency"]) ?? "USD",
    },
    terms: {
      exclusivity: brief.exclusivity ?? "",
      usage_rights: brief.usage_rights ?? "",
    },
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        Edit brief
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
        {brief.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Edit any step, then save. Only drafts can be edited.
      </p>

      <div className="mt-8">
        <BriefWizard mode={{ kind: "edit", briefId: brief.id }} initial={initial} />
      </div>
    </section>
  );
}
