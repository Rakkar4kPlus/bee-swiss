import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata = {
  title: "Über uns — Bee Swiss",
};

export default function UeberUnsPage() {
  return (
    <Container className="py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/placeholders/imker-portrait.svg"
            alt="Porträt der Imkerei Bee Swiss (Platzhalter)"
            className="w-full object-cover"
          />
        </div>
        <div>
          <SectionHeading eyebrow="Über uns" title="Unsere Imkerei in Basel" />
          <div className="mt-5 space-y-4 leading-relaxed text-ink-700/90">
            <p>
              Bee Swiss ist eine kleine, familiengeführte Imkerei in Basel.
              Was als Hobby mit wenigen Völkern begann, ist heute eine
              Leidenschaft, die wir mit Sorgfalt und Respekt vor der Natur
              betreiben.
            </p>
            <p>
              Unsere Bienenvölker stehen an sonnigen, blütenreichen Standorten
              rund um Basel. Wir schleudern unseren Honig kalt und schonend,
              füllen ihn direkt ab und verzichten bewusst auf jegliche
              Zusätze — so bleibt der volle, natürliche Geschmack erhalten.
            </p>
            <p>
              Neben Honig züchten wir auch eigene Bienenköniginnen. Uns ist
              wichtig, dass unsere Völker sanftmütig, gesund und
              widerstandsfähig sind — Eigenschaften, die wir bei der Zucht
              gezielt fördern.
            </p>
            <p>
              Wir freuen uns, wenn du unsere Produkte probierst — direkt ab
              Hof, im Onlineshop oder auf Anfrage.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
