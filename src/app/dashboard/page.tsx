import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.role) redirect("/role-select");

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        00 · You&apos;re in
      </p>
      <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">
        Welcome,{" "}
        <span className="italic text-brand">
          {profile.display_name ?? user.email}
        </span>
      </h1>
      <p className="mt-3 max-w-xl text-base text-muted-foreground">
        You&apos;re signed in as a {profile.role}. The full dashboard ships in
        the next slice — brand briefs, creator profiles, and discovery come
        online soon.
      </p>

      <dl className="mt-10 grid max-w-md grid-cols-2 gap-6 border-t border-border/70 pt-6">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Role
          </dt>
          <dd className="mt-1 font-display text-xl text-ink capitalize">
            {profile.role}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Email
          </dt>
          <dd className="mt-1 font-display text-xl text-ink">{user.email}</dd>
        </div>
      </dl>
    </section>
  );
}
