import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin Übersicht — Bee Swiss",
};

export default async function AdminDashboardPage() {
  const [productCount, newOrders, unreadMessages, totalOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { status: "NEU" } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.order.count(),
  ]);

  const cards = [
    { label: "Neue Bestellanfragen", value: newOrders, href: "/admin/bestellungen" },
    { label: "Ungelesene Nachrichten", value: unreadMessages, href: "/admin/nachrichten" },
    { label: "Produkte", value: productCount, href: "/admin/produkte" },
    { label: "Bestellungen gesamt", value: totalOrders, href: "/admin/bestellungen" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Übersicht</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl bg-cream-50 p-6 shadow-sm ring-1 ring-honey-200/60 transition-shadow hover:shadow-md"
          >
            <p className="text-3xl font-semibold text-ink-900">{card.value}</p>
            <p className="mt-1 text-sm text-ink-700/70">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-honey-50 p-6">
        <h2 className="font-display text-lg font-semibold text-ink-900">Schnellzugriff</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/admin/produkte/neu"
            className="rounded-full bg-honey-500 px-5 py-2.5 text-sm font-medium text-cream-50 hover:bg-honey-600"
          >
            Neues Produkt anlegen
          </Link>
          <Link
            href="/admin/bestellungen"
            className="rounded-full border border-honey-300 px-5 py-2.5 text-sm font-medium text-ink-800 hover:bg-honey-100"
          >
            Bestellungen ansehen
          </Link>
        </div>
      </div>
    </div>
  );
}
