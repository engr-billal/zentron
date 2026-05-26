import { AuthCard } from "../_components/auth-card";
import { selectRole } from "../_actions/auth.actions";
import { RoleSelectForm } from "./_components/role-select-form";

export const metadata = { title: "Choose your role" };

export default function RoleSelectPage() {
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
