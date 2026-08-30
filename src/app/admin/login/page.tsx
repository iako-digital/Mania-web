"use client";

import { useState, useActionState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <form action={formAction} className="w-full max-w-sm border border-hairline bg-surface p-8">
        <h1 className="font-display text-2xl text-text-primary">მართვის პანელი</h1>
        <p className="mt-1 text-sm text-text-muted">მანია ვაშაკიძე — კონტენტის მართვა</p>

        <label htmlFor="email" className="mt-8 block font-mono text-xs uppercase tracking-widest text-text-muted">
          ელ-ფოსტა
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoFocus
          className="mt-2 w-full border-b border-hairline bg-transparent py-3 text-text-primary focus:border-gold focus:outline-none"
        />

        <label htmlFor="password" className="mt-6 block font-mono text-xs uppercase tracking-widest text-text-muted">
          პაროლი
        </label>
        <div className="relative mt-2">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="w-full border-b border-hairline bg-transparent py-3 pr-9 text-text-primary focus:border-gold focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "პაროლის დამალვა" : "პაროლის ჩვენება"}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-text-muted transition-colors hover:text-gold cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {state.error && <p className="mt-4 text-sm text-red-400">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-8 w-full bg-gold px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-text-primary disabled:opacity-50 cursor-pointer"
        >
          {pending ? "მოწმდება…" : "შესვლა"}
        </button>
      </form>
    </div>
  );
}
