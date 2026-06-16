import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { markAllNotificationsRead } from "@/lib/notifications";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const unread = (notifications ?? []).filter((n) => !n.read_at).length;

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-12 sm:px-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-brand">
            Notifications
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink">
            Your <span className="italic text-brand">updates.</span>
          </h1>
        </div>
        {unread > 0 ? (
          <form action={markAllNotificationsRead}>
            <button
              type="submit"
              className="text-xs font-medium text-brand hover:underline"
            >
              Mark all read
            </button>
          </form>
        ) : null}
      </div>

      <ul className="mt-8 flex flex-col gap-3">
        {(notifications ?? []).length === 0 ? (
          <li className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            <Bell className="mx-auto mb-3 size-6 text-brand" />
            No notifications yet. Activity on briefs, contracts, and milestones
            will show up here.
          </li>
        ) : (
          (notifications ?? []).map((n) => (
            <li key={n.id}>
              <Link
                href={n.href ?? "/dashboard/notifications"}
                className={`block rounded-xl border p-4 transition-colors hover:border-brand/40 ${
                  n.read_at
                    ? "border-border bg-card"
                    : "border-brand/30 bg-brand/5"
                }`}
              >
                <p className="text-sm font-medium text-ink">{n.title}</p>
                {n.body ? (
                  <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                ) : null}
                <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </Link>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
