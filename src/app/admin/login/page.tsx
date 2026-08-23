"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <form action={formAction} className="w-full max-w-sm border border-hairline bg-surface p-8">
        <h1 className="font-display text-2xl text-text-primary">Admin</h1>
        <p className="mt-1 text-sm text-text-muted">Mania Vashakidze — content panel</p>

        <label htmlFor="password" className="mt-8 block font-mono text-xs uppercase tracking-widest text-text-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="mt-2 w-full border-b border-hairline bg-transparent py-3 text-text-primary focus:border-gold focus:outline-none"
        />

        {state.error && <p className="mt-4 text-sm text-red-400">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-8 w-full bg-gold px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-text-primary disabled:opacity-50 cursor-pointer"
        >
          {pending ? "Checking…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
