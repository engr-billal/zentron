import { createClient } from "@/lib/supabase/server";
import { NavbarShell } from "./navbar-shell";

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dashboardHref = "/dashboard";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.role) dashboardHref = "/role-select";
  }

  return (
    <NavbarShell isAuthenticated={!!user} dashboardHref={dashboardHref} />
  );
}
