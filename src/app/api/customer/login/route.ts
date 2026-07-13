import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Bitte E-Mail und Passwort angeben." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const customer = await prisma.customer.findUnique({ where: { email } });

  if (!customer || !(await verifyPassword(password, customer.passwordHash))) {
    return NextResponse.json({ error: "E-Mail oder Passwort ist falsch." }, { status: 401 });
  }

  await createSession({
    sub: customer.id,
    role: "customer",
    email: customer.email,
    name: customer.name,
  });

  return NextResponse.json({ ok: true });
}
