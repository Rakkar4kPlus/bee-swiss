import { redirect } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getCustomerSession } from "@/lib/auth";

export const metadata = {
  title: "Mein Konto — Bee Swiss",
};

export default async function KontoPage() {
  const session = await getCustomerSession();
  if (!session) redirect("/konto/login");

  return (
    <Container className="py-16">
      <SectionHeading eyebrow="Kundenkonto" title={`Hallo, ${session.name}`} />

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Link
          href="/konto/warenkorb"
          className="rounded-2xl bg-cream-50 p-6 shadow-sm ring-1 ring-honey-200/60 transition-shadow hover:shadow-md"
        >
          <h3 className="font-display text-lg font-semibold text-ink-900">Warenkorb</h3>
          <p className="mt-1 text-sm text-ink-700/70">
            Deine aktuelle Auswahl ansehen und eine Bestellanfrage senden.
          </p>
        </Link>
        <Link
          href="/konto/bestellungen"
          className="rounded-2xl bg-cream-50 p-6 shadow-sm ring-1 ring-honey-200/60 transition-shadow hover:shadow-md"
        >
          <h3 className="font-display text-lg font-semibold text-ink-900">Meine Bestellungen</h3>
          <p className="mt-1 text-sm text-ink-700/70">
            Übersicht über deine bisherigen Bestellanfragen und deren Status.
          </p>
        </Link>
      </div>

      <div className="mt-10 flex items-center justify-between rounded-2xl bg-honey-50 p-6">
        <div className="text-sm text-ink-700/80">
          <p className="font-medium text-ink-900">{session.name}</p>
          <p>{session.email}</p>
        </div>
        <LogoutButton />
      </div>
    </Container>
  );
}
