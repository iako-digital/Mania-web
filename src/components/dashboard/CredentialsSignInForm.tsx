"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Alternative to Google sign-in for students an admin has manually set a
// password for (see /admin/students → "პაროლის შეცვლა" — src/auth.ts wires
// up the matching "credentials" provider).
export function CredentialsSignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res.error) {
        setError("ელ-ფოსტა ან პაროლი არასწორია.");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <details className="text-left">
      <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold">
        პაროლით შესვლა
      </summary>
      <form onSubmit={submit} className="mt-2 flex w-56 flex-col gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ელ-ფოსტა"
          className="border-b border-hairline bg-transparent py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-gold focus:outline-none"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="პაროლი"
          className="border-b border-hairline bg-transparent py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gold px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-text-primary disabled:opacity-50 cursor-pointer"
        >
          {loading ? "შესვლა…" : "შესვლა"}
        </button>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </form>
    </details>
  );
}
