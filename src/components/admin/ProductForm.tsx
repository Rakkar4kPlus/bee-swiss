"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ProductFormValues = {
  id?: string;
  name: string;
  categoryId: string;
  price: number;
  unit: string;
  description: string;
  available: boolean;
  featured: boolean;
};

type CategoryOption = { id: string; name: string };

export function ProductForm({
  product,
  categories,
}: {
  product?: ProductFormValues;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      categoryId: String(data.get("categoryId") ?? ""),
      price: Number(data.get("price")),
      unit: String(data.get("unit") ?? ""),
      description: String(data.get("description") ?? ""),
      available: data.get("available") === "on",
      featured: data.get("featured") === "on",
    };

    try {
      const res = await fetch(
        product?.id ? `/api/admin/products/${product.id}` : "/api/admin/products",
        {
          method: product?.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Speichern fehlgeschlagen.");

      if (product?.id) {
        setSaved(true);
        router.refresh();
      } else {
        router.push(`/admin/produkte/${json.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-800">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={product?.name}
            className="w-full rounded-xl border border-honey-200 bg-cream-50 px-4 py-3 text-ink-900 outline-none focus:border-honey-500"
          />
        </div>
        <div>
          <label htmlFor="categoryId" className="mb-1.5 block text-sm font-medium text-ink-800">
            Kategorie
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={product?.categoryId ?? categories[0]?.id}
            required
            className="w-full rounded-xl border border-honey-200 bg-cream-50 px-4 py-3 text-ink-900 outline-none focus:border-honey-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="mt-1 text-xs text-red-700">
              Bitte lege zuerst eine Kategorie an.
            </p>
          )}
        </div>
        <div>
          <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-ink-800">
            Preis (CHF)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.05"
            min="0"
            required
            defaultValue={product?.price}
            className="w-full rounded-xl border border-honey-200 bg-cream-50 px-4 py-3 text-ink-900 outline-none focus:border-honey-500"
          />
        </div>
        <div>
          <label htmlFor="unit" className="mb-1.5 block text-sm font-medium text-ink-800">
            Einheit
          </label>
          <input
            id="unit"
            name="unit"
            type="text"
            required
            placeholder="z.B. 500g Glas"
            defaultValue={product?.unit}
            className="w-full rounded-xl border border-honey-200 bg-cream-50 px-4 py-3 text-ink-900 outline-none focus:border-honey-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink-800">
          Beschreibung
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={product?.description}
          className="w-full rounded-xl border border-honey-200 bg-cream-50 px-4 py-3 text-ink-900 outline-none focus:border-honey-500"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-ink-800">
          <input
            type="checkbox"
            name="available"
            defaultChecked={product?.available ?? true}
            className="h-4 w-4 rounded border-honey-300 text-honey-600"
          />
          Verfügbar / im Shop sichtbar
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-800">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured ?? false}
            className="h-4 w-4 rounded border-honey-300 text-honey-600"
          />
          Auf Startseite hervorheben
        </label>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-green-700">Gespeichert.</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-honey-500 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-honey-600 disabled:opacity-60"
      >
        {loading ? "Wird gespeichert…" : product?.id ? "Speichern" : "Produkt anlegen"}
      </button>
    </form>
  );
}
