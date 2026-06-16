import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthCard } from "../_components/auth-card";
import { selectRole } from "../_actions/auth.actions";
import { RoleSelectForm } from "./_components/role-select-form";

export const metadata = { title: "Choose your role" };

export default async function RoleSelectPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const params = await searchParams;
  const metaRole = user.user_metadata?.intended_role as string | undefined;
  const hint =
    params.role === "brand" || params.role === "creator"
      ? params.role
      : metaRole === "brand" || metaRole === "creator"
        ? metaRole
        : undefined;

  return (
    <AuthCard
      eyebrow="One more step"
      title={
        <>
          Which side are <span className="italic text-brand">you on?</span>
        </>
      }
      description="Pick the role that fits. You can run separate accounts later if you wear both hats."
    >
      <RoleSelectForm
        action={selectRole}
        defaultRole={hint}
        options={[
          {
            value: "brand",
            label: "I'm a brand",
            blurb: "Find creators, run campaigns, pay through escrow.",
          },
          {
            value: "creator",
            label: "I'm a creator",
            blurb: "Get matched with paid briefs, build your Zentron Score.",
          },
        ]}
      />
    </AuthCard>
  );
}
