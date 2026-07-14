import "server-only";
import path from "node:path";

/**
 * Verzeichnis für hochgeladene Bilder - bewusst AUSSERHALB von public/, da
 * Next.js beim Ausliefern von public/ Symlinks auf Verzeichnisse ausserhalb
 * des public-Ordners aus Sicherheitsgründen nicht zuverlässig folgt. Die
 * Dateien werden stattdessen über src/app/uploads/[...path]/route.ts
 * ausgeliefert.
 *
 * In Produktion (Render) zeigt UPLOAD_DIR auf das persistente Disk-Volume
 * (z.B. /data/uploads). Lokal wird ohne gesetzte Variable ein "uploads"-
 * Ordner im Projektverzeichnis verwendet.
 */
export function getUploadDir() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
}

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export function contentTypeForExtension(extension: string) {
  return CONTENT_TYPES[extension.toLowerCase()] ?? "application/octet-stream";
}
