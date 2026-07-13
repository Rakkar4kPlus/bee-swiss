"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({
  url,
  confirmText,
  label = "Löschen",
}: {
  url: string;
  confirmText: string;
  label?: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Löschen fehlgeschlagen.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Löschen fehlgeschlagen.");
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  }

  if (confirming) {
    return (
      <div className="inline-flex flex-col items-end gap-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-ink-700">{confirmText}</span>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="font-medium text-red-700 hover:underline disabled:opacity-60"
          >
            {loading ? "…" : "Ja, löschen"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={loading}
            className="text-ink-700/60 hover:underline"
          >
            Abbrechen
          </button>
        </div>
        {error && <p className="max-w-[220px] text-right text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm font-medium text-red-700 hover:underline"
    >
      {label}
    </button>
  );
}
