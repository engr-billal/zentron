import { BriefDetail } from "@/app/dashboard/briefs/[id]/_components/brief-detail";
import type { Tables } from "@/types/database";

export function BriefReadOnly({ brief }: { brief: Tables<"briefs"> }) {
  // Reuse the brand-side read-only renderer; semantics are identical
  return <BriefDetail brief={brief} />;
}
