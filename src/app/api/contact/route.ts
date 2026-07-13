import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendNotificationMail } from "@/lib/mail";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Bitte gib deinen Namen an."),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse an."),
  message: z.string().trim().min(5, "Deine Nachricht ist zu kurz."),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." },
      { status: 400 }
    );
  }

  const { name, email, message } = parsed.data;

  await prisma.contactMessage.create({ data: { name, email, message } });

  await sendNotificationMail({
    subject: `Neue Kontaktanfrage von ${name}`,
    text: `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
  });

  return NextResponse.json({ ok: true });
}
