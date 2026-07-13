import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/slug";

const schema = z.object({
  name: z.string().trim().min(2, "Bitte gib einen Produktnamen an."),
  categoryId: z.string().trim().min(1, "Bitte wähle eine Kategorie."),
  price: z.number().positive("Der Preis muss grösser als 0 sein."),
  unit: z.string().trim().min(1, "Bitte gib eine Einheit an."),
  description: z.string().trim().min(1, "Bitte gib eine Beschreibung an."),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
});

async function uniqueSlug(base: string) {
  let slug = base || "produkt";
  let i = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
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

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
  });
  if (!category) {
    return NextResponse.json({ error: "Die gewählte Kategorie existiert nicht." }, { status: 400 });
  }

  const slug = await uniqueSlug(slugify(parsed.data.name));

  const product = await prisma.product.create({
    data: { ...parsed.data, slug },
  });

  return NextResponse.json({ ok: true, id: product.id, slug: product.slug });
}
