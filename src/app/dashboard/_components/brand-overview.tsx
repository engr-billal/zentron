import { createClient } from "@/lib/supabase/server";

export async function BrandOverview({ userId }: { userId: string }) {
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from("brand_profiles")
    .select("company_name")
    .eq("id", userId)
    .maybeSingle();

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        00 · Brand
      </p>
      <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">
        Welcome,{" "}
        <span className="italic text-brand">
          {brand?.company_name ?? "Brand"}
        </span>
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        The brand dashboard ships in the next slice — briefs creation,
        algorithmic shortlists, and creator discovery come online soon.
      </p>
    </section>
  );
}
