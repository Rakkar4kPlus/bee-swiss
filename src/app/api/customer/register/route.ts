import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2, "Bitte gib deinen Namen an."),
  email: z.string().trim().toLowerCase().email("Bitte gib eine gültige E-Mail-Adresse an."),
  password: z.string().min(6, "Das Passwort muss mindestens 6 Zeichen haben."),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." },
      { status: 400 }
    );
  }

  const { name, email, password, phone, address } = parsed.data;

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Für diese E-Mail-Adresse besteht bereits ein Konto." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const customer = await prisma.customer.create({
    data: { name, email, passwordHash, phone, address },
  });

  await createSession({
    sub: customer.id,
    role: "customer",
    email: customer.email,
    name: customer.name,
  });

  return NextResponse.json({ ok: true });
}
