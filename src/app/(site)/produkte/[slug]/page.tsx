import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { AddToCart } from "@/components/AddToCart";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/format";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const mainImage = product.images[0];

  return (
    <Container className="py-16">
      <nav className="mb-8 text-sm text-ink-700/70">
        <Link href="/produkte" className="hover:text-honey-600">
          Produkte
        </Link>{" "}
        / <span className="text-ink-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-honey-50">
          {mainImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mainImage.url}
              alt={mainImage.alt || product.name}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-honey-300">
              Kein Bild
            </div>
          )}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 p-2">
              {product.images.slice(1).map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={img.url}
                  alt={img.alt || product.name}
                  className="aspect-square rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-sm font-semibold uppercase tracking-wide text-honey-600">
            {product.category.name}
          </span>
          <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
            {product.name}
          </h1>
          <p className="text-lg font-semibold text-ink-900">
            {formatPrice(product.price)}{" "}
            <span className="text-base font-normal text-ink-700/70">
              / {product.unit}
            </span>
          </p>
          <p className="leading-relaxed text-ink-700/90">{product.description}</p>

          <div className="mt-4">
            <AddToCart
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              unit={product.unit}
              imageUrl={mainImage?.url ?? null}
              available={product.available}
            />
          </div>

          <p className="mt-2 text-xs text-ink-700/60">
            Beim Absenden einer Bestellanfrage meldest du dich einmalig an —
            wir bestätigen deine Bestellung anschliessend persönlich.
          </p>
        </div>
      </div>
    </Container>
  );
}
