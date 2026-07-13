"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export function CartView({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { items, setQuantity, removeItem, totalPrice, clear } = useCart();
  const router = useRouter();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="rounded-2xl bg-honey-50 p-10 text-center">
        <p className="font-display text-2xl font-semibold text-ink-900">
          Danke für deine Bestellanfrage!
        </p>
        <p className="mt-2 text-ink-700/80">
          Wir melden uns persönlich bei dir, um die Bestellung zu bestätigen.
        </p>
        <Link
          href="/konto/bestellungen"
          className="mt-6 inline-flex rounded-full bg-honey-500 px-6 py-3 text-sm font-medium text-cream-50 hover:bg-honey-600"
        >
          Meine Bestellungen ansehen
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-honey-50 p-10 text-center">
        <p className="text-ink-800">Dein Warenkorb ist leer.</p>
        <Link
          href="/produkte"
          className="mt-6 inline-flex rounded-full bg-honey-500 px-6 py-3 text-sm font-medium text-cream-50 hover:bg-honey-600"
        >
          Produkte entdecken
        </Link>
      </div>
    );
  }

  async function submitOrder() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          note: note || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Bestellung konnte nicht gesendet werden.");
      clear();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Etwas ist schiefgelaufen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="divide-y divide-honey-200/60 overflow-hidden rounded-2xl bg-cream-50 shadow-sm ring-1 ring-honey-200/60">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 p-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-honey-50">
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-ink-900">{item.name}</p>
              <p className="text-sm text-ink-700/70">{item.unit}</p>
            </div>
            <div className="flex items-center rounded-full border border-honey-300">
              <button
                type="button"
                className="px-3 py-1.5 text-lg text-honey-700"
                onClick={() => setQuantity(item.productId, item.quantity - 1)}
                aria-label="Menge verringern"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                className="px-3 py-1.5 text-lg text-honey-700"
                onClick={() => setQuantity(item.productId, item.quantity + 1)}
                aria-label="Menge erhöhen"
              >
                +
              </button>
            </div>
            <div className="w-20 text-right text-sm font-medium text-ink-900">
              {formatPrice(item.price * item.quantity)}
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              className="text-ink-700/50 hover:text-red-700"
              aria-label="Entfernen"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-lg font-semibold text-ink-900">
        <span>Zwischensumme</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>

      <div>
        <label htmlFor="note" className="mb-1.5 block text-sm font-medium text-ink-800">
          Anmerkung (optional)
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="z.B. Wunschtermin für die Abholung"
          className="w-full rounded-xl border border-honey-200 bg-cream-50 px-4 py-3 text-ink-900 outline-none focus:border-honey-500"
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      {isLoggedIn ? (
        <button
          onClick={submitOrder}
          disabled={loading}
          className="w-full rounded-full bg-honey-500 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-honey-600 disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Wird gesendet…" : "Bestellanfrage senden"}
        </button>
      ) : (
        <div className="rounded-xl bg-honey-50 p-4 text-sm text-ink-800">
          Bitte{" "}
          <button
            onClick={() => router.push("/konto/login")}
            className="font-medium text-honey-700 underline"
          >
            einloggen
          </button>{" "}
          oder{" "}
          <button
            onClick={() => router.push("/konto/registrieren")}
            className="font-medium text-honey-700 underline"
          >
            registrieren
          </button>
          , um deine Bestellanfrage zu senden. Dein Warenkorb bleibt erhalten.
        </div>
      )}
    </div>
  );
}
