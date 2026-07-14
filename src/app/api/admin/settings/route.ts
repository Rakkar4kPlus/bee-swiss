import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { SETTINGS_ID } from "@/lib/settings";

const schema = z.object({
  heroEyebrow: z.string().trim().min(1).optional(),
  heroTitle: z.string().trim().min(1).optional(),
  heroSubtitle: z.string().trim().min(1).optional(),
  usp1Title: z.string().trim().min(1).optional(),
  usp1Text: z.string().trim().min(1).optional(),
  usp2Title: z.string().trim().min(1).optional(),
  usp2Text: z.string().trim().min(1).optional(),
  usp3Title: z.string().trim().min(1).optional(),
  usp3Text: z.string().trim().min(1).optional(),
  ctaTitle: z.string().trim().min(1).optional(),
  ctaText: z.string().trim().min(1).optional(),
  aboutTitle: z.string().trim().min(1).optional(),
  aboutText: z.string().trim().min(1).optional(),
  contactIntro: z.string().trim().min(1).optional(),
  contactEmail: z.string().trim().min(1).optional(),
  contactAddress: z.string().trim().min(1).optional(),
  openingHours: z.string().trim().min(1).optional(),
  footerTagline: z.string().trim().min(1).optional(),
});

export async function PATCH(request: Request) {
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

  await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: parsed.data,
    create: { id: SETTINGS_ID, ...parsed.data },
  });

  return NextResponse.json({ ok: true });
}
