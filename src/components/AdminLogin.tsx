"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error || "Could not sign in.");
      setPending(false);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md px-4 pb-24 pt-36">
      <p className="font-royal text-[0.68rem] uppercase tracking-[0.28em] text-gold">Studio</p>
      <h1 className="mt-3 font-display text-5xl italic text-cream">Leads</h1>
      <label className="mt-8 block text-sm text-mist" htmlFor="admin-password">
        Password
        <input
          id="admin-password"
          className="field mt-2"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
      </label>
      {error ? <p className="mt-4 text-sm text-gold-2">{error}</p> : null}
      <button type="submit" disabled={pending} className="mt-6 bg-gold px-6 py-3 text-[0.72rem] uppercase tracking-[0.2em] text-deep">
        {pending ? "Checking" : "Enter"}
      </button>
    </form>
  );
}
