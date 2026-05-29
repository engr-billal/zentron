import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/permissions";
import { AccountSettingsForm } from "./_components/account-settings-form";
import { BrandInvoicingForm } from "./_components/brand-invoicing-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, country, role")
    .eq("id", user.id)
    .maybeSingle();
  const role = (profile?.role ?? null) as UserRole | null;
  if (!role) redirect("/role-select");

  let billingCountry = "";
  if (role === "brand") {
    const { data: brand } = await supabase
      .from("brand_profiles")
      .select("billing_country")
      .eq("id", user.id)
      .maybeSingle();
    billingCountry = brand?.billing_country ?? "";
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        Settings
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
        Your <span className="italic text-brand">account.</span>
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Personal details, country, and how Zentron addresses you. Profile and
        platform data live on the dedicated profile pages.
      </p>

      <div className="mt-10 flex flex-col gap-10">
        <Section title="Account" subtitle="Visible to the people you collaborate with.">
          <AccountSettingsForm
            initialDisplayName={profile?.display_name ?? ""}
            initialCountry={profile?.country ?? ""}
          />
        </Section>

        <Section
          title="Sign-in"
          subtitle="Email is set when you create an account. Password reset coming soon."
        >
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-sm">
            <Row label="Email" value={user.email ?? "—"} />
            <Row
              label="Provider"
              value={user.app_metadata?.provider ?? "email"}
            />
          </div>
        </Section>

        {role === "brand" ? (
          <Section
            title="Invoicing"
            subtitle="Captured for invoice headers and tax region. Real billing rails ship later."
          >
            <BrandInvoicingForm initialCountry={billingCountry} />
          </Section>
        ) : null}

        <Section title="Sign out" subtitle="Ends your session on this device.">
          <form action="/api/auth/sign-out" method="post">
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </Section>
      </div>
    </section>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="font-display text-xl text-ink">{title}</h2>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-ink/90">{value}</span>
    </div>
  );
}
