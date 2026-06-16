"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Wordmark } from "./wordmark";

const links = [
  { href: "/for-brands", label: "For brands" },
  { href: "/for-creators", label: "For creators" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

type Props = {
  isAuthenticated: boolean;
  dashboardHref: string;
  userLabel?: string;
  userEmail?: string;
};

export function NavbarShell({
  isAuthenticated,
  dashboardHref,
  userLabel,
  userEmail,
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!userOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [userOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:px-10">
        <Link href="/" aria-label="Zentron Solutions home">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-ink transition-colors hover:border-brand/40"
                aria-expanded={userOpen}
                aria-haspopup="menu"
              >
                <User className="size-3.5 text-brand" />
                <span className="max-w-[140px] truncate">
                  {userLabel ?? "Account"}
                </span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>
              {userOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg"
                >
                  {userEmail ? (
                    <p className="border-b border-border px-3 py-2 text-xs text-muted-foreground">
                      {userEmail}
                    </p>
                  ) : null}
                  <Link
                    role="menuitem"
                    href={dashboardHref}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-surface"
                    onClick={() => setUserOpen(false)}
                  >
                    <ArrowUpRight className="size-3.5" />
                    Dashboard
                  </Link>
                  <Link
                    role="menuitem"
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-surface"
                    onClick={() => setUserOpen(false)}
                  >
                    <Settings className="size-3.5" />
                    Settings
                  </Link>
                  <form action="/api/auth/sign-out" method="post">
                    <button
                      type="submit"
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink hover:bg-surface"
                    >
                      <LogOut className="size-3.5" />
                      Sign out
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Get early access</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-9 items-center justify-center rounded-md border border-border/80 text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d={open ? "M3 3l10 10M3 13L13 3" : "M2 4h12M2 8h12M2 12h12"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-border/70 bg-paper md:hidden">
          <nav
            className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-6 py-4"
            aria-label="Mobile"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              {isAuthenticated ? (
                <>
                  <p className="px-3 text-xs text-muted-foreground">
                    {userLabel}
                    {userEmail ? ` · ${userEmail}` : ""}
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link href={dashboardHref} onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setOpen(false)}
                    >
                      Settings
                    </Link>
                  </Button>
                  <form action="/api/auth/sign-out" method="post">
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="w-full"
                    >
                      Sign out
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Link href="/sign-in" onClick={() => setOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link href="/sign-up" onClick={() => setOpen(false)}>
                      Get early access
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
