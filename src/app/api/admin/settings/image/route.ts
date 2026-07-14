import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getUploadDir } from "@/lib/uploads";
import { getSiteSettings, SETTINGS_ID } from "@/lib/settings";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_SIZE_BYTES = 6 * 1024 * 1024;
const ALLOWED_FIELDS = ["heroImageUrl", "aboutImageUrl"] as const;
type Field = (typeof ALLOWED_FIELDS)[number];

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const field = formData?.get("field");

  if (typeof field !== "string" || !ALLOWED_FIELDS.includes(field as Field)) {
    return NextResponse.json({ error: "Ungültiges Feld." }, { status: 400 });
  }
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei erhalten." }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Nur Bilder (JPG, PNG, WEBP, GIF) sind erlaubt." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Die Datei ist zu gross (max. 6 MB)." }, { status: 400 });
  }

  const uploadDir = path.join(getUploadDir(), "site");
  await mkdir(uploadDir, { recursive: true });

  const filename = `${field}-${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  const url = `/uploads/site/${filename}`;
  const previous = await getSiteSettings();

  await prisma.siteSettings.update({
    where: { id: SETTINGS_ID },
    data: { [field]: url },
  });

  const previousUrl = previous[field as Field];
  if (previousUrl?.startsWith("/uploads/")) {
    try {
      await unlink(path.join(getUploadDir(), previousUrl.replace(/^\/uploads\//, "")));
    } catch {
      // Datei bereits entfernt oder nicht auffindbar - ignorieren
    }
  }

  return NextResponse.json({ ok: true, url });
}
