import Link from "next/link";
import { formatPrice } from "@/lib/format";

export type ProductCardData = {
  slug: string;
  name: string;
  categoryName: string;
  price: number;
  unit: string;
  available: boolean;
  imageUrl: string | null;
  imageAlt: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/produkte/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-honey-200/60 bg-cream-50 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-honey-50">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.imageAlt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-honey-300">
            Kein Bild
          </div>
        )}
        {!product.available && (
          <span className="absolute left-3 top-3 rounded-full bg-ink-900/85 px-3 py-1 text-xs font-medium text-cream-50">
            Ausverkauft
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-honey-600">
          {product.categoryName}
        </span>
        <h3 className="text-lg font-semibold text-ink-900">{product.name}</h3>
        <p className="text-sm text-ink-700/70">{product.unit}</p>
        <div className="mt-auto pt-3 text-base font-semibold text-ink-900">
          {formatPrice(product.price)}
        </div>
      </div>
    </Link>
  );
}
