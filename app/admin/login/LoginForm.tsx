// app/admin/login/LoginForm.tsx
"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next ?? "/admin"} />

      <div>
        <label className="block font-sans text-xs font-medium uppercase tracking-[0.08em] text-ink/50">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          autoFocus
          className="mt-2 w-full border border-ink/15 bg-white px-3.5 py-2.5 font-sans text-sm text-ink focus:border-brass focus:outline-none"
        />
      </div>

      {state?.error && <p className="font-sans text-sm text-oxblood">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ink py-3 font-sans text-xs font-medium uppercase tracking-[0.12em] text-ivory transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
