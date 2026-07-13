"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/customer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Login fehlgeschlagen.");
      router.push("/konto");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login fehlgeschlagen.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-800">
          E-Mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-honey-200 bg-cream-50 px-4 py-3 text-ink-900 outline-none focus:border-honey-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-800">
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-xl border border-honey-200 bg-cream-50 px-4 py-3 text-ink-900 outline-none focus:border-honey-500"
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-honey-500 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-honey-600 disabled:opacity-60"
      >
        {loading ? "Wird eingeloggt…" : "Einloggen"}
      </button>

      <p className="text-center text-sm text-ink-700/70">
        Noch kein Konto?{" "}
        <Link href="/konto/registrieren" className="text-honey-700 hover:underline">
          Jetzt registrieren
        </Link>
      </p>
    </form>
  );
}
