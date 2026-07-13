import { prisma } from "@/lib/prisma";
import type { ProductCardData } from "@/components/ProductCard";

function toCardData(product: {
  slug: string;
  name: string;
  category: { name: string; slug: string };
  price: number;
  unit: string;
  available: boolean;
  images: { url: string; alt: string }[];
}): ProductCardData {
  const first = product.images[0];
  return {
    slug: product.slug,
    name: product.name,
    categoryName: product.category.name,
    price: product.price,
    unit: product.unit,
    available: product.available,
    imageUrl: first?.url ?? null,
    imageAlt: first?.alt || product.name,
  };
}

export async function getFeaturedProducts(limit = 4) {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      category: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toCardData);
}

export async function getAllProducts(categorySlug?: string) {
  const products = await prisma.product.findMany({
    where: categorySlug ? { category: { slug: categorySlug } } : undefined,
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      category: true,
    },
    orderBy: [{ available: "desc" }, { createdAt: "desc" }],
  });
  return products.map(toCardData);
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      category: true,
    },
  });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { position: "asc" } });
}
