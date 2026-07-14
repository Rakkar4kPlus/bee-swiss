import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCustomerSession } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, settings] = await Promise.all([getCustomerSession(), getSiteSettings()]);

  return (
    <CartProvider>
      <Header customerName={session?.name ?? null} />
      <main className="flex-1">{children}</main>
      <Footer
        tagline={settings.footerTagline}
        address={settings.contactAddress}
        email={settings.contactEmail}
        openingHours={settings.openingHours}
      />
    </CartProvider>
  );
}
