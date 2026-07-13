import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { ImageManager } from "@/components/admin/ImageManager";

export const metadata = {
  title: "Produkt bearbeiten — Admin",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { position: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">{product.name}</h1>
      <p className="mt-1 text-sm text-ink-700/70">/produkte/{product.slug}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-cream-50 p-6 shadow-sm ring-1 ring-honey-200/60">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">
            Produktdaten
          </h2>
          <ProductForm
            product={{
              id: product.id,
              name: product.name,
              categoryId: product.categoryId,
              price: product.price,
              unit: product.unit,
              description: product.description,
              available: product.available,
              featured: product.featured,
            }}
            categories={categories}
          />
        </div>

        <div className="rounded-2xl bg-cream-50 p-6 shadow-sm ring-1 ring-honey-200/60">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Bilder</h2>
          <ImageManager
            productId={product.id}
            images={product.images.map((i) => ({ id: i.id, url: i.url, alt: i.alt }))}
          />
        </div>
      </div>
    </div>
  );
}
