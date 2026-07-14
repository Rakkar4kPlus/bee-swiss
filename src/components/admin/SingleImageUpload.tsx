"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function SingleImageUpload({
  field,
  label,
  currentUrl,
  fallbackUrl,
}: {
  field: "heroImageUrl" | "aboutImageUrl";
  label: string;
  currentUrl: string | null;
  fallbackUrl: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload() {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("field", field);
      formData.append("file", file);
      const res = await fetch("/api/admin/settings/image", {
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

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink-800">{label}</p>
      <div className="overflow-hidden rounded-xl bg-honey-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentUrl ?? fallbackUrl}
          alt=""
          className="aspect-video w-full object-cover"
        />
      </div>
      {!currentUrl && (
        <p className="mt-1 text-xs text-ink-700/60">
          Aktuell wird ein Platzhalterbild angezeigt.
        </p>
      )}
      <div className="mt-2 flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
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
