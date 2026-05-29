"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/permissions";

const BRAND_LINKS = [
  { href: "/dashboard", label: "Overview", match: (p: string) => p === "/dashboard" },
  {
    href: "/dashboard/briefs",
    label: "Briefs",
    match: (p: string) => p.startsWith("/dashboard/briefs"),
  },
  {
    href: "/dashboard/contracts",
    label: "Contracts",
    match: (p: string) => p.startsWith("/dashboard/contracts"),
  },
  {
    href: "/dashboard/campaigns",
    label: "Campaigns",
    match: (p: string) => p.startsWith("/dashboard/campaigns"),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    match: (p: string) => p.startsWith("/dashboard/settings"),
  },
] as const;

const CREATOR_LINKS = [
  { href: "/dashboard", label: "Score", match: (p: string) => p === "/dashboard" },
  {
    href: "/dashboard/invitations",
    label: "Invitations",
    match: (p: string) => p.startsWith("/dashboard/invitations"),
  },
  {
    href: "/dashboard/contracts",
    label: "Contracts",
    match: (p: string) => p.startsWith("/dashboard/contracts"),
  },
  {
    href: "/dashboard/campaigns",
    label: "Campaigns",
    match: (p: string) => p.startsWith("/dashboard/campaigns"),
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    match: (p: string) => p.startsWith("/dashboard/profile"),
  },
  {
    href: "/dashboard/platforms",
    label: "Platforms",
    match: (p: string) => p.startsWith("/dashboard/platforms"),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    match: (p: string) => p.startsWith("/dashboard/settings"),
  },
] as const;

export function DashboardNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const links = role === "brand" ? BRAND_LINKS : CREATOR_LINKS;

  return (
    <nav className="flex flex-wrap items-center gap-6">
      {links.map((link) => {
        const active = link.match(pathname ?? "");
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors",
              active
                ? "text-ink"
                : "text-muted-foreground hover:text-ink",
            )}
          >
            {link.label}
            {active ? (
              <span
                aria-hidden
                className="mt-0.5 block h-0.5 w-full bg-brand"
              />
            ) : (
              <span aria-hidden className="mt-0.5 block h-0.5 w-full bg-transparent" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
