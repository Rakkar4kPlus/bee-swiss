import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const metadata = {
  title: "Bestellungen — Admin",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, customer: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Bestellanfragen</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-ink-700/70">Noch keine Bestellanfragen eingegangen.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const total = order.items.reduce((s, i) => s + i.quantity * i.priceEach, 0);
            return (
              <div
                key={order.id}
                className="rounded-2xl bg-cream-50 p-6 shadow-sm ring-1 ring-honey-200/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink-900">{order.customer.name}</p>
                    <p className="text-sm text-ink-700/70">{order.customer.email}</p>
                    {order.customer.phone && (
                      <p className="text-sm text-ink-700/70">{order.customer.phone}</p>
                    )}
                    <p className="mt-1 text-xs text-ink-700/50">
                      {new Intl.DateTimeFormat("de-CH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(order.createdAt)}
                    </p>
                  </div>
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </div>

                <ul className="mt-4 space-y-1 border-t border-honey-100 pt-3 text-sm text-ink-800">
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
                <div className="mt-3 text-right text-sm font-semibold text-ink-900">
                  Total: {formatPrice(total)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
