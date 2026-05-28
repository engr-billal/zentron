import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { BriefAudienceInput } from "@/lib/validations/brief";
import { BriefWizard } from "./_components/brief-wizard";

export const metadata = { title: "New brief" };

export default async function NewBriefPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: brand } = await supabase
    .from("brand_profiles")
    .select("default_niches, default_platforms, default_audience_bands, billing_country")
    .eq("id", user.id)
    .maybeSingle();

  if (!brand) redirect("/onboarding/brand");

  const defaults = {
    niches: brand.default_niches,
    platforms: brand.default_platforms,
    audienceBands:
      brand.default_audience_bands as BriefAudienceInput["audience_size_bands"],
    currency: "USD" as const,
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        New brief
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
        Write a <span className="italic text-brand">brief.</span>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Five quick steps. We&apos;ll show matching creators the moment you
        publish.
      </p>

      <div className="mt-8">
        <BriefWizard mode={{ kind: "new" }} defaults={defaults} />
      </div>
    </section>
  );
}
