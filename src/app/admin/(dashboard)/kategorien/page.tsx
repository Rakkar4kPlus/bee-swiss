import { prisma } from "@/lib/prisma";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const metadata = {
  title: "Kategorien — Admin",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { position: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Kategorien</h1>
      <p className="mt-1 text-sm text-ink-700/70">
        Kategorien werden bei den Produkten zur Auswahl angeboten und im Shop als Filter angezeigt.
      </p>
      <div className="mt-6 max-w-xl rounded-2xl bg-cream-50 p-6 shadow-sm ring-1 ring-honey-200/60">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
