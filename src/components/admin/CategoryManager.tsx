"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export type AdminCategory = { id: string; name: string; slug: string };

export function CategoryManager({ categories }: { categories: AdminCategory[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAdding(true);
    setAddError(null);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Anlegen fehlgeschlagen.");
      form.reset();
      router.refresh();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Anlegen fehlgeschlagen.");
    } finally {
      setAdding(false);
    }
  }

  function startEdit(category: AdminCategory) {
    setEditingId(category.id);
    setEditValue(category.name);
    setEditError(null);
  }

  async function handleRename(id: string) {
    setBusyId(id);
    setEditError(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editValue }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Umbenennen fehlgeschlagen.");
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Umbenennen fehlgeschlagen.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Löschen fehlgeschlagen.");
      setConfirmingId(null);
      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Löschen fehlgeschlagen.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <ul className="divide-y divide-honey-100">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between gap-3 py-3">
            {editingId === category.id ? (
              <div className="flex flex-1 items-center gap-2">
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 rounded-lg border border-honey-200 bg-cream-50 px-3 py-1.5 text-sm text-ink-900 outline-none focus:border-honey-500"
                />
                <button
                  onClick={() => handleRename(category.id)}
                  disabled={busyId === category.id}
                  className="text-sm font-medium text-honey-700 hover:underline disabled:opacity-60"
                >
                  Speichern
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-sm text-ink-700/60 hover:underline"
                >
                  Abbrechen
                </button>
              </div>
            ) : (
              <span className="font-medium text-ink-900">{category.name}</span>
            )}

            {editingId !== category.id && (
              <div className="flex items-center gap-3">
                {confirmingId === category.id ? (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-ink-700">Wirklich löschen?</span>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={busyId === category.id}
                      className="font-medium text-red-700 hover:underline disabled:opacity-60"
                    >
                      Ja
                    </button>
                    <button
                      onClick={() => setConfirmingId(null)}
                      className="text-ink-700/60 hover:underline"
                    >
                      Nein
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(category)}
                      className="text-sm font-medium text-honey-700 hover:underline"
                    >
                      Umbenennen
                    </button>
                    <button
                      onClick={() => setConfirmingId(category.id)}
                      className="text-sm font-medium text-red-700 hover:underline"
                    >
                      Löschen
                    </button>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
        {categories.length === 0 && (
          <li className="py-6 text-sm text-ink-700/60">Noch keine Kategorien angelegt.</li>
        )}
      </ul>
      {editError && <p className="mt-2 text-sm text-red-700">{editError}</p>}
      {deleteError && <p className="mt-2 text-sm text-red-700">{deleteError}</p>}

      <form onSubmit={handleAdd} className="mt-6 flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-800">
            Neue Kategorie
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="z.B. Imkerei Produkte"
            className="w-full rounded-xl border border-honey-200 bg-cream-50 px-4 py-3 text-ink-900 outline-none focus:border-honey-500"
          />
        </div>
        <button
          type="submit"
          disabled={adding}
          className="rounded-full bg-honey-500 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-honey-600 disabled:opacity-60"
        >
          {adding ? "Wird angelegt…" : "Hinzufügen"}
        </button>
      </form>
      {addError && <p className="mt-2 text-sm text-red-700">{addError}</p>}
    </div>
  );
}
