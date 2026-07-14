import { NextResponse } from "next/server";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { getUploadDir } from "@/lib/uploads";

export async function PATCH(
  _request: Request,
  ctx: RouteContext<"/api/admin/products/images/[imageId]">
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  const { imageId } = await ctx.params;
  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) return NextResponse.json({ error: "Bild nicht gefunden." }, { status: 404 });

  const siblings = await prisma.productImage.findMany({
    where: { productId: image.productId },
    orderBy: { position: "asc" },
  });

  const reordered = [image, ...siblings.filter((s) => s.id !== imageId)];
  await Promise.all(
    reordered.map((img, index) =>
      prisma.productImage.update({ where: { id: img.id }, data: { position: index } })
    )
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/admin/products/images/[imageId]">
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  const { imageId } = await ctx.params;
  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) return NextResponse.json({ error: "Bild nicht gefunden." }, { status: 404 });

  await prisma.productImage.delete({ where: { id: imageId } });

  if (image.url.startsWith("/uploads/")) {
    try {
      const relativePath = image.url.replace(/^\/uploads\//, "");
      await unlink(path.join(getUploadDir(), relativePath));
    } catch {
      // Datei bereits entfernt oder nicht auffindbar - ignorieren
    }
  }

  return NextResponse.json({ ok: true });
}
