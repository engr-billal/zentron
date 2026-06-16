import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/permissions";
import { AccountSettingsForm } from "./_components/account-settings-form";
import { BrandInvoicingForm } from "./_components/brand-invoicing-form";
import { BrandProfileForm } from "./_components/brand-profile-form";
import { PasswordChangeForm } from "./_components/password-change-form";

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
  let brandProfile = {
    company_name: "",
    website: "",
    industry: "",
    logo_url: "",
  };
  if (role === "brand") {
    const { data: brand } = await supabase
      .from("brand_profiles")
      .select("billing_country, company_name, website, industry, logo_url")
      .eq("id", user.id)
      .maybeSingle();
    billingCountry = brand?.billing_country ?? "";
    brandProfile = {
      company_name: brand?.company_name ?? "",
      website: brand?.website ?? "",
      industry: brand?.industry ?? "",
      logo_url: brand?.logo_url ?? "",
    };
  }

  const provider = user.app_metadata?.provider ?? "email";
  const isEmailUser = provider === "email";

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
        Settings
      </p>
      <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
        Your <span className="italic text-brand">account.</span>
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Each section saves independently. Changes apply immediately after you
        click save.
      </p>

      <div className="mt-10 flex flex-col gap-8">
        <SettingsCard
          title="Personal"
          subtitle="Your name and country — shown to collaborators."
        >
          <AccountSettingsForm
            initialDisplayName={profile?.display_name ?? ""}
            initialCountry={profile?.country ?? ""}
          />
        </SettingsCard>

        {role === "brand" ? (
          <SettingsCard
            title="Company profile"
            subtitle="Business identity on briefs and contracts."
          >
            <BrandProfileForm
              initialCompanyName={brandProfile.company_name}
              initialWebsite={brandProfile.website}
              initialIndustry={brandProfile.industry}
              initialLogoUrl={brandProfile.logo_url}
            />
          </SettingsCard>
        ) : null}

        <SettingsCard
          title="Sign-in"
          subtitle={
            isEmailUser
              ? "Email sign-in. Use forgot password if you need to reset."
              : "Signed in with an external provider."
          }
        >
          <div className="flex flex-col gap-2 text-sm">
            <Row label="Email" value={user.email ?? "—"} />
            <Row label="Provider" value={provider} />
          </div>
          {isEmailUser ? (
            <>
              <Button asChild variant="outline" size="sm" className="mt-4 w-fit">
                <a href="/forgot-password">Email reset link</a>
              </Button>
              <PasswordChangeForm />
            </>
          ) : null}
        </SettingsCard>

        {role === "brand" ? (
          <SettingsCard
            title="Invoicing"
            subtitle="Billing country for invoice headers."
          >
            <BrandInvoicingForm initialCountry={billingCountry} />
          </SettingsCard>
        ) : null}

        <SettingsCard title="Session" subtitle="Sign out on this device.">
          <form action="/api/auth/sign-out" method="post">
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </SettingsCard>
      </div>
    </section>
  );
}

function SettingsCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 border-b border-border pb-4">
        <h2 className="font-display text-xl text-ink">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2 sm:grid-cols-[140px_1fr]">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-ink/90">{value}</span>
    </div>
  );
}
