import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  CREATOR_PLATFORM_TYPES,
  CURRENCIES,
} from "@/lib/constants/creator";
import { ProfileForm } from "./_components/profile-form";

export const metadata = { title: "Edit profile" };

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const [{ data: profile }, { data: creator }] = await Promise.all([
    supabase.from("profiles").select("country").eq("id", user.id).maybeSingle(),
    supabase
      .from("creator_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  if (!creator) redirect("/onboarding/creator");

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-12 sm:px-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        Edit profile
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
        Your <span className="italic text-brand">profile.</span>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Changes to niches or primary platform recompute your Zentron Score.
      </p>

      <div className="mt-8">
        <ProfileForm
          initial={{
            handle: creator.handle,
            country: profile?.country ?? "GB",
            languages: creator.languages,
            bio: creator.bio ?? "",
            niches: creator.niches,
            primary_platform: creator.primary_platform as
              (typeof CREATOR_PLATFORM_TYPES)[number],
            base_rate_cents: creator.base_rate_cents,
            currency:
              (creator.currency as (typeof CURRENCIES)[number] | null) ?? "USD",
          }}
        />
      </div>
    </section>
  );
}
