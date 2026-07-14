import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getUploadDir } from "@/lib/uploads";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};

const MAX_SIZE_BYTES = 6 * 1024 * 1024;

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/admin/products/[id]/images">
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  const { id: productId } = await ctx.params;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Produkt nicht gefunden." }, { status: 404 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei erhalten." }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Nur Bilder (JPG, PNG, WEBP, GIF, SVG) sind erlaubt." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Die Datei ist zu gross (max. 6 MB)." }, { status: 400 });
  }

  const uploadDir = path.join(getUploadDir(), "products", productId);
  await mkdir(uploadDir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  const position = await prisma.productImage.count({ where: { productId } });
  const image = await prisma.productImage.create({
    data: {
      productId,
      url: `/uploads/products/${productId}/${filename}`,
      alt: product.name,
      position,
    },
  });

  return NextResponse.json({ ok: true, image });
}
