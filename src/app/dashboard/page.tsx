import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreatorOverview } from "./_components/creator-overview";
import { BrandOverview } from "./_components/brand-overview";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.role) redirect("/role-select");

  if (profile.role === "creator") {
    return <CreatorOverview userId={user.id} />;
  }
  return <BrandOverview userId={user.id} />;
}
