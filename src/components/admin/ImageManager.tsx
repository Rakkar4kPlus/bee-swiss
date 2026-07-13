"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type AdminImage = { id: string; url: string; alt: string };

export function ImageManager({
  productId,
  images,
}: {
  productId: string;
  images: AdminImage[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function handleUpload() {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload fehlgeschlagen.");
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(imageId: string) {
    setBusyId(imageId);
    try {
      await fetch(`/api/admin/products/images/${imageId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusyId(null);
      setConfirmingId(null);
    }
  }

  async function handleMakeMain(imageId: string) {
    setBusyId(imageId);
    try {
      await fetch(`/api/admin/products/images/${imageId}`, { method: "PATCH" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image, index) => (
          <div key={image.id} className="group relative overflow-hidden rounded-xl bg-honey-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.alt} className="aspect-square w-full object-cover" />
            {index === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-honey-500 px-2 py-0.5 text-[11px] font-medium text-cream-50">
                Hauptbild
              </span>
            )}
            <div
              className={`absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-ink-900/70 p-1.5 transition-opacity ${
                confirmingId === image.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              {confirmingId === image.id ? (
                <div className="flex w-full items-center justify-between gap-1">
                  <span className="text-[11px] text-cream-50">Löschen?</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(image.id)}
                      disabled={busyId === image.id}
                      className="rounded bg-red-600 px-2 py-1 text-[11px] font-medium text-cream-50 disabled:opacity-60"
                    >
                      Ja
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingId(null)}
                      className="rounded bg-cream-50/90 px-2 py-1 text-[11px] font-medium text-ink-800"
                    >
                      Nein
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleMakeMain(image.id)}
                      disabled={busyId === image.id}
                      className="rounded bg-cream-50/90 px-2 py-1 text-[11px] font-medium text-ink-800 disabled:opacity-60"
                    >
                      Hauptbild
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setConfirmingId(image.id)}
                    disabled={busyId === image.id}
                    className="ml-auto rounded bg-red-600/90 px-2 py-1 text-[11px] font-medium text-cream-50 disabled:opacity-60"
                  >
                    Löschen
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <p className="col-span-full text-sm text-ink-700/60">Noch keine Bilder hochgeladen.</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={handleUpload}
          disabled={uploading}
          className="text-sm text-ink-700"
        />
        {uploading && <span className="text-sm text-ink-700/60">Wird hochgeladen…</span>}
      </div>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
