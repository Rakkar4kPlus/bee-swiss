"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Etwas ist schiefgelaufen.");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Etwas ist schiefgelaufen.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-honey-50 p-8 text-center">
        <p className="font-display text-xl font-semibold text-ink-900">
          Danke für deine Nachricht!
        </p>
        <p className="mt-2 text-ink-700/80">
          Wir melden uns schnellstmöglich bei dir zurück.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-800">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-xl border border-honey-200 bg-cream-50 px-4 py-3 text-ink-900 outline-none focus:border-honey-500"
        />
      </div>
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
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-800">
          Nachricht
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-xl border border-honey-200 bg-cream-50 px-4 py-3 text-ink-900 outline-none focus:border-honey-500"
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-full bg-honey-500 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-honey-600 disabled:opacity-60"
      >
        {status === "loading" ? "Wird gesendet…" : "Nachricht senden"}
      </button>
    </form>
  );
}
