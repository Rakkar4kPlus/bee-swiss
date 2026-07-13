import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const schema = z.object({
  read: z.boolean(),
});

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/admin/messages/[id]">
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  const { id } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Eingabe." }, { status: 400 });
  }

  await prisma.contactMessage.update({ where: { id }, data: { read: parsed.data.read } });

  return NextResponse.json({ ok: true });
}
