"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-gold cursor-pointer"
    >
      გასვლა
    </button>
  );
}
