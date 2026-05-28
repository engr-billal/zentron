import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import type { UserRole } from "@/lib/permissions";

export type SessionContext = {
  response: NextResponse;
  user: { id: string; email: string | null } | null;
  role: UserRole | null;
  onboarded: boolean;
};

export async function updateSession(
  request: NextRequest,
): Promise<SessionContext> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { response, user: null, role: null, onboarded: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role ?? null) as UserRole | null;

  let onboarded = false;
  if (role === "brand") {
    const { data } = await supabase
      .from("brand_profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    onboarded = !!data;
  } else if (role === "creator") {
    const { data } = await supabase
      .from("creator_profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    onboarded = !!data;
  } else if (role === "admin") {
    onboarded = true;
  }

  return {
    response,
    user: { id: user.id, email: user.email ?? null },
    role,
    onboarded,
  };
}
