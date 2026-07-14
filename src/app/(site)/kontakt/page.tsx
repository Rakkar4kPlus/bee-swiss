import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/settings";

export const metadata = {
  title: "Kontakt — Bee Swiss",
};

export default async function KontaktPage() {
  const settings = await getSiteSettings();

  return (
    <Container className="py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Kontakt" title="Schreib uns" description={settings.contactIntro} />
          <div className="mt-8 space-y-3 text-sm text-ink-700/80">
            <p>Bee Swiss · {settings.contactAddress}</p>
            <p>
              <a href={`mailto:${settings.contactEmail}`} className="text-honey-700 hover:underline">
                {settings.contactEmail}
              </a>
            </p>
            <p>{settings.openingHours}</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </Container>
  );
}
