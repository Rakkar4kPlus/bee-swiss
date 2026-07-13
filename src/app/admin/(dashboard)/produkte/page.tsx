import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata = {
  title: "Produkte — Admin",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Produkte</h1>
        <Link
          href="/admin/produkte/neu"
          className="rounded-full bg-honey-500 px-5 py-2.5 text-sm font-medium text-cream-50 hover:bg-honey-600"
        >
          + Neues Produkt
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-cream-50 shadow-sm ring-1 ring-honey-200/60">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-honey-50 text-xs uppercase tracking-wide text-ink-700/70">
              <tr>
                <th className="px-4 py-3">Bild</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Kategorie</th>
                <th className="px-4 py-3">Preis</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-honey-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-honey-100">
                      {product.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0].url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink-900">{product.name}</td>
                  <td className="px-4 py-3 text-ink-700/80">{product.category.name}</td>
                  <td className="px-4 py-3 text-ink-700/80">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        product.available
                          ? "bg-green-100 text-green-700"
                          : "bg-ink-900/10 text-ink-700"
                      }`}
                    >
                      {product.available ? "Verfügbar" : "Ausverkauft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/produkte/${product.id}`}
                        className="text-sm font-medium text-honey-700 hover:underline"
                      >
                        Bearbeiten
                      </Link>
                      <DeleteButton
                        url={`/api/admin/products/${product.id}`}
                        confirmText={`„${product.name}“ wirklich löschen?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <p className="p-8 text-center text-ink-700/70">Noch keine Produkte angelegt.</p>
        )}
      </div>
    </div>
  );
}
