import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/slug";

const schema = z.object({
  name: z.string().trim().min(2, "Bitte gib einen Namen für die Kategorie an."),
});

async function uniqueSlug(base: string) {
  let slug = base || "kategorie";
  let i = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    i += 1;
    slug = `${base}-${i}`;
  }
  return slug;
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." },
      { status: 400 }
    );
  }

  const slug = await uniqueSlug(slugify(parsed.data.name));
  const maxPosition = await prisma.category.aggregate({ _max: { position: true } });

  const category = await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug,
      position: (maxPosition._max.position ?? -1) + 1,
    },
  });

  return NextResponse.json({ ok: true, category });
}
