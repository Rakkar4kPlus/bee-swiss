import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCustomerSession } from "@/lib/auth";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCustomerSession();

  return (
    <CartProvider>
      <Header customerName={session?.name ?? null} />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}
