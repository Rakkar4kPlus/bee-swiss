import { redirect } from "next/navigation";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { getCustomerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, orderStatusLabel } from "@/lib/format";

export const metadata = {
  title: "Meine Bestellungen — Bee Swiss",
};

const STATUS_STYLES: Record<string, string> = {
  NEU: "bg-honey-100 text-honey-700",
  IN_BEARBEITUNG: "bg-blue-100 text-blue-700",
  ERLEDIGT: "bg-green-100 text-green-700",
};

export default async function BestellungenPage() {
  const session = await getCustomerSession();
  if (!session) redirect("/konto/login");

  const orders = await prisma.order.findMany({
    where: { customerId: session.sub },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Container className="py-16">
      <SectionHeading eyebrow="Kundenkonto" title="Meine Bestellungen" />

      {orders.length === 0 ? (
        <p className="mt-10 text-ink-700/70">Du hast noch keine Bestellanfrage gesendet.</p>
      ) : (
        <div className="mt-10 space-y-4">
          {orders.map((order) => {
            const total = order.items.reduce((s, i) => s + i.quantity * i.priceEach, 0);
            return (
              <div
                key={order.id}
                className="rounded-2xl bg-cream-50 p-6 shadow-sm ring-1 ring-honey-200/60"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-ink-700/70">
                    {new Intl.DateTimeFormat("de-CH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(order.createdAt)}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}
                  >
                    {orderStatusLabel(order.status)}
                  </span>
                </div>
                <ul className="mt-4 space-y-1 text-sm text-ink-800">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.quantity}× {item.product.name}
                      </span>
                      <span>{formatPrice(item.priceEach * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                {order.note && (
                  <p className="mt-3 text-sm italic text-ink-700/70">„{order.note}“</p>
                )}
                <div className="mt-4 flex justify-end border-t border-honey-200/60 pt-3 text-sm font-semibold text-ink-900">
                  Total: {formatPrice(total)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}
