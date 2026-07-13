import Link from "next/link";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

const USPS = [
  {
    title: "Naturrein aus Basel",
    text: "Unsere Bienenvölker stehen rund um Basel — kurze Wege, volle Frische.",
  },
  {
    title: "Handwerklich erzeugt",
    text: "Kaltgeschleudert und schonend abgefüllt, ohne Zusätze.",
  },
  {
    title: "Direkt vom Imker",
    text: "Kein Zwischenhandel — du kaufst direkt bei uns, mit Herz für die Biene.",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/placeholders/hero-banner.svg"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/20 to-transparent" />
        </div>
        <Container className="relative flex min-h-[560px] flex-col justify-end gap-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-honey-200">
            Imkerei in Basel
          </p>
          <h1 className="max-w-xl font-display text-4xl font-semibold text-cream-50 sm:text-5xl">
            Bee Swiss — naturrein, regional, mit Liebe zur Biene
          </h1>
          <p className="max-w-lg text-cream-100/90">
            Wir sind eine kleine Imkerei in Basel und verkaufen unseren Honig
            sowie sanftmütige Bienenköniginnen direkt ab Hof.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/produkte" variant="primary">
              Produkte entdecken
            </Button>
            <Button href="/ueber-uns" variant="outline" className="border-cream-100 text-cream-50 hover:bg-cream-50/10">
              Über uns
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-b border-honey-200/60 bg-honey-50">
        <Container className="grid gap-8 py-12 sm:grid-cols-3">
          {USPS.map((usp) => (
            <div key={usp.title}>
              <h3 className="font-display text-lg font-semibold text-ink-900">
                {usp.title}
              </h3>
              <p className="mt-2 text-sm text-ink-700/80">{usp.text}</p>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="py-20">
          <SectionHeading
            eyebrow="Sortiment"
            title="Unsere beliebtesten Produkte"
            description="Vom würzigen Waldhonig bis zur sanftmütigen Königin — eine Auswahl aus unserem Sortiment."
          />
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button href="/produkte" variant="outline">
              Alle Produkte ansehen
            </Button>
          </div>
        </Container>
      </section>

      <section className="bg-honey-900 text-cream-100">
        <Container className="flex flex-col items-center gap-6 py-20 text-center">
          <h2 className="font-display text-3xl font-semibold text-cream-50 sm:text-4xl">
            Fragen zu Honig oder Bienenköniginnen?
          </h2>
          <p className="max-w-xl text-cream-100/80">
            Melde dich gerne über unser Kontaktformular — wir antworten
            schnellstmöglich.
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center rounded-full bg-honey-500 px-6 py-3 text-sm font-medium text-cream-50 hover:bg-honey-400"
          >
            Zum Kontaktformular
          </Link>
        </Container>
      </section>
    </div>
  );
}
