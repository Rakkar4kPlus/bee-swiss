import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Kontakt — Bee Swiss",
};

export default function KontaktPage() {
  return (
    <Container className="py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Kontakt"
            title="Schreib uns"
            description="Fragen zu Honig, Bienenköniginnen oder einer grösseren Bestellung? Wir freuen uns von dir zu hören."
          />
          <div className="mt-8 space-y-3 text-sm text-ink-700/80">
            <p>Bee Swiss · Basel, Schweiz</p>
            <p>
              <a href="mailto:nilsfoelsen.swiss@gmail.com" className="text-honey-700 hover:underline">
                nilsfoelsen.swiss@gmail.com
              </a>
            </p>
            <p>Hofladen: Samstag 09:00–12:00 Uhr, oder nach Vereinbarung</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </Container>
  );
}
