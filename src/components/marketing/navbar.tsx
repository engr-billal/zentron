import { createClient } from "@/lib/supabase/server";
import { NavbarShell } from "./navbar-shell";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dashboardHref = "/dashboard";
  let userLabel: string | undefined;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, role")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.role) dashboardHref = "/role-select";
    userLabel = profile?.display_name?.trim() || user.email?.split("@")[0];
  }

  return (
    <NavbarShell
      isAuthenticated={!!user}
      dashboardHref={dashboardHref}
      userLabel={userLabel}
      userEmail={user?.email ?? undefined}
    />
  );
}
