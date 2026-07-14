import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { getSiteSettings } from "@/lib/settings";

export const metadata = {
  title: "Über uns — Bee Swiss",
};

export default async function UeberUnsPage() {
  const settings = await getSiteSettings();
  const paragraphs: string[] = settings.aboutText.split(/\n\s*\n/).filter(Boolean);

  return (
    <Container className="py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={settings.aboutImageUrl ?? "/placeholders/imker-portrait.svg"}
            alt="Porträt der Imkerei Bee Swiss"
            className="w-full object-cover"
          />
        </div>
        <div>
          <SectionHeading eyebrow="Über uns" title={settings.aboutTitle} />
          <div className="mt-5 space-y-4 leading-relaxed text-ink-700/90">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
