import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const schema = z.object({
  status: z.enum(["NEU", "IN_BEARBEITUNG", "ERLEDIGT"]),
});

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/admin/orders/[id]">
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültiger Status." }, { status: 400 });
  }

  await prisma.order.update({ where: { id }, data: { status: parsed.data.status } });

  return NextResponse.json({ ok: true });
}
