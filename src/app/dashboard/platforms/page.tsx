import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PlatformsManager } from "./_components/platforms-manager";

export const metadata = { title: "Manage platforms" };

export default async function PlatformsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const [{ data: creator }, { data: platforms }] = await Promise.all([
    supabase
      .from("creator_profiles")
      .select("primary_platform")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("creator_platforms")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: true }),
  ]);

  if (!creator) redirect("/onboarding/creator");

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        Platforms
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
        Where you <span className="italic text-brand">publish.</span>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Add, edit, or remove your platforms. Each change recomputes your
        Zentron Score.
      </p>

      <div className="mt-8">
        <PlatformsManager
          initial={platforms ?? []}
          primary={creator.primary_platform}
        />
      </div>
    </section>
  );
}
