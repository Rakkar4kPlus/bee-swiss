import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Neues Produkt — Admin",
};

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { position: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Neues Produkt</h1>
      <p className="mt-1 text-sm text-ink-700/70">
        Nach dem Anlegen kannst du Bilder hochladen.
      </p>
      <div className="mt-6 max-w-2xl rounded-2xl bg-cream-50 p-6 shadow-sm ring-1 ring-honey-200/60">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
