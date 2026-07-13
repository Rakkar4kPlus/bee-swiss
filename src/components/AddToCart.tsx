"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export function AddToCart({
  productId,
  slug,
  name,
  price,
  unit,
  imageUrl,
  available,
}: {
  productId: string;
  slug: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string | null;
  available: boolean;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!available) {
    return (
      <p className="rounded-lg bg-ink-900/5 px-4 py-3 text-sm text-ink-700">
        Dieses Produkt ist aktuell ausverkauft. Schau bald wieder vorbei oder{" "}
        <button
          className="underline"
          onClick={() => router.push("/kontakt")}
        >
          frag uns direkt an
        </button>
        .
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center rounded-full border border-honey-300">
        <button
          type="button"
          className="px-4 py-2 text-lg text-honey-700"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="Menge verringern"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <button
          type="button"
          className="px-4 py-2 text-lg text-honey-700"
          onClick={() => setQuantity((q) => q + 1)}
          aria-label="Menge erhöhen"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          addItem({ productId, slug, name, price, unit, imageUrl }, quantity);
          setAdded(true);
          setTimeout(() => setAdded(false), 2000);
        }}
        className="inline-flex items-center justify-center rounded-full bg-honey-500 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-honey-600"
      >
        {added ? "Im Warenkorb ✓" : "In den Warenkorb"}
      </button>
    </div>
  );
}
