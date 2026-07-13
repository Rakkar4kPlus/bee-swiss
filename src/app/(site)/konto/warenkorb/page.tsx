import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { CartView } from "@/components/CartView";
import { getCustomerSession } from "@/lib/auth";

export const metadata = {
  title: "Warenkorb — Bee Swiss",
};

export default async function WarenkorbPage() {
  const session = await getCustomerSession();

  return (
    <Container className="py-16">
      <SectionHeading eyebrow="Warenkorb" title="Deine Auswahl" />
      <div className="mt-8 max-w-3xl">
        <CartView isLoggedIn={Boolean(session)} />
      </div>
    </Container>
  );
}
