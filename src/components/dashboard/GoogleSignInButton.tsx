"use client";

import { signIn } from "next-auth/react";

export function GoogleSignInButton({ configured }: { configured: boolean }) {
  if (!configured) {
    return (
      <span className="font-mono text-xs uppercase tracking-widest text-text-muted/50" title="Google სავალდებულოა — მალე დაემატება">
        Google-ით შესვლა (მალე)
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("google")}
      className="font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:text-gold cursor-pointer"
    >
      Google-ით შესვლა
    </button>
  );
}
