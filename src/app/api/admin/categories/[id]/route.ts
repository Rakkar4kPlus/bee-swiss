import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2, "Bitte gib einen Namen für die Kategorie an."),
});

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/admin/categories/[id]">
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

  await prisma.category.update({ where: { id }, data: { name: parsed.data.name } });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/admin/categories/[id]">
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  const { id } = await ctx.params;

  const productsInCategory = await prisma.product.count({ where: { categoryId: id } });
  if (productsInCategory > 0) {
    return NextResponse.json(
      {
        error: `Diese Kategorie wird noch von ${productsInCategory} Produkt(en) verwendet und kann nicht gelöscht werden. Ordne die Produkte zuerst einer anderen Kategorie zu.`,
      },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
