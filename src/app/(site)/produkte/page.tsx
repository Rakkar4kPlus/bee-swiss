import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import { getAllProducts, getCategories } from "@/lib/products";
import Link from "next/link";

export const metadata = {
  title: "Produkte — Bee Swiss",
};

export default async function ProduktePage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const { kategorie } = await searchParams;
  const categories = await getCategories();
  const activeCategory = categories.find((c) => c.slug === kategorie)?.slug;

  const products = await getAllProducts(activeCategory);

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Sortiment"
        title="Unsere Produkte"
        description="Honig direkt aus Basler Wäldern und Gärten sowie sanftmütige Bienenköniginnen aus eigener Nachzucht."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/produkte"
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !activeCategory
              ? "bg-honey-500 text-cream-50"
              : "bg-honey-50 text-ink-800 hover:bg-honey-100"
          }`}
        >
          Alle
        </Link>
        {categories.map((cat) => {
          const isActive = cat.slug === activeCategory;
          return (
            <Link
              key={cat.id}
              href={`/produkte?kategorie=${cat.slug}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-honey-500 text-cream-50"
                  : "bg-honey-50 text-ink-800 hover:bg-honey-100"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-ink-700/70">
          In dieser Kategorie sind aktuell keine Produkte verfügbar.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </Container>
  );
}
