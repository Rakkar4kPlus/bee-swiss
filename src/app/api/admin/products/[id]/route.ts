import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2).optional(),
  categoryId: z.string().trim().min(1).optional(),
  price: z.number().positive().optional(),
  unit: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/admin/products/[id]">
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." },
      { status: 400 }
    );
  }

  if (parsed.data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: parsed.data.categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { error: "Die gewählte Kategorie existiert nicht." },
        { status: 400 }
      );
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ ok: true, id: product.id });
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/admin/products/[id]">
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  const { id } = await ctx.params;

  const usedInOrders = await prisma.orderItem.count({ where: { productId: id } });
  if (usedInOrders > 0) {
    return NextResponse.json(
      {
        error:
          "Dieses Produkt wurde bereits bestellt und kann nicht gelöscht werden. Markiere es stattdessen als „nicht verfügbar“.",
      },
      { status: 409 }
    );
  }

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
