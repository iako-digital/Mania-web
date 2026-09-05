"use client";

import NextLink from "next/link";
import { signIn, signOut } from "next-auth/react";

// Shown in both the desktop Header and the MobileNav drawer for
// non-logged-in visitors — the site's only sign-up path is Google OAuth
// (see src/auth.ts), so "რეგისტრაცია" (Register) and "Google-ით შესვლა"
// are the same action: signing in with Google creates the account on
// first use. Logged-in visitors get a link to their dashboard instead.
export function AuthNavLink({
  isLoggedIn,
  googleConfigured,
  registerLabel,
  registerSoonLabel,
  dashboardLabel,
  logoutLabel,
  size = "sm",
  className = "",
}: {
  isLoggedIn: boolean;
  googleConfigured: boolean;
  registerLabel: string;
  registerSoonLabel: string;
  dashboardLabel: string;
  logoutLabel: string;
  size?: "sm" | "lg";
  className?: string;
}) {
  if (isLoggedIn) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <NextLink
          href="/dashboard"
          className={
            size === "lg"
              ? "font-display text-2xl text-gold"
              : "font-mono text-xs uppercase tracking-widest text-gold transition-colors hover:text-text-primary"
          }
        >
          {dashboardLabel}
        </NextLink>
        <button
          type="button"
          onClick={() => signOut()}
          className="font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-red-400 cursor-pointer"
        >
          {logoutLabel}
        </button>
      </div>
    );
  }

  if (!googleConfigured) {
    return (
      <span className={`font-mono text-xs uppercase tracking-widest text-text-muted/50 ${className}`} title={registerSoonLabel}>
        {registerSoonLabel}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("google")}
      title="Google-ით შესვლა / რეგისტრაცია"
      className={
        (size === "lg"
          ? "bg-gold px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-text-primary"
          : "bg-gold px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-text-primary") +
        ` cursor-pointer ${className}`
      }
    >
      {registerLabel}
    </button>
  );
}
