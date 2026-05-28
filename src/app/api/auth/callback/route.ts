import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/role-select";

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      `${origin}/sign-in?error=${encodeURIComponent(error.message)}`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/sign-in`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.role) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  if (profile.role === "creator") {
    const { data: creator } = await supabase
      .from("creator_profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    return NextResponse.redirect(
      `${origin}${creator ? "/dashboard" : "/onboarding/creator"}`,
    );
  }

  if (profile.role === "brand") {
    const { data: brand } = await supabase
      .from("brand_profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    return NextResponse.redirect(
      `${origin}${brand ? "/dashboard" : "/onboarding/brand"}`,
    );
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
