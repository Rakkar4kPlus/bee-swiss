import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";
import { sendNotificationMail } from "@/lib/mail";
import { formatPrice } from "@/lib/format";

const schema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Dein Warenkorb ist leer."),
  note: z.string().trim().max(1000).optional(),
});

export async function POST(request: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Bitte logg dich zuerst ein." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Bestellung." },
      { status: 400 }
    );
  }

  const { items, note } = parsed.data;

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
  });

  if (products.length !== items.length) {
    return NextResponse.json(
      { error: "Ein Produkt im Warenkorb ist nicht mehr verfügbar." },
      { status: 400 }
    );
  }

  const order = await prisma.order.create({
    data: {
      customerId: session.sub,
      note,
      items: {
        create: items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return {
            productId: product.id,
            quantity: item.quantity,
            priceEach: product.price,
          };
        }),
      },
    },
    include: { items: { include: { product: true } } },
  });

  const summary = order.items
    .map((i) => `${i.quantity}x ${i.product.name} (${formatPrice(i.priceEach)})`)
    .join("\n");

  await sendNotificationMail({
    subject: `Neue Bestellanfrage von ${session.name}`,
    text: `Kunde: ${session.name} (${session.email})\n\nBestellung:\n${summary}${
      note ? `\n\nAnmerkung:\n${note}` : ""
    }`,
  });

  return NextResponse.json({ ok: true, orderId: order.id });
}
