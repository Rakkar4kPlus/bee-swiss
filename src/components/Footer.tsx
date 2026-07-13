import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-honey-200/60 bg-honey-900 text-cream-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-xl font-semibold text-cream-50">
            Bee Swiss
          </span>
          <p className="mt-3 text-sm text-cream-100/70 leading-relaxed">
            Naturreiner Honig und Bienenköniginnen direkt vom Imker aus Basel —
            handwerklich erzeugt, mit Liebe zur Biene.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-honey-300">
            Navigation
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/produkte" className="hover:text-honey-300">Produkte</Link></li>
            <li><Link href="/ueber-uns" className="hover:text-honey-300">Über uns</Link></li>
            <li><Link href="/kontakt" className="hover:text-honey-300">Kontakt</Link></li>
            <li><Link href="/konto/login" className="hover:text-honey-300">Kundenkonto</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-honey-300">
            Kontakt
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-cream-100/80">
            <li>Bee Swiss</li>
            <li>Basel, Schweiz</li>
            <li>
              <a href="mailto:nilsfoelsen.swiss@gmail.com" className="hover:text-honey-300">
                nilsfoelsen.swiss@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-honey-300">
            Öffnungszeiten Hofladen
          </h3>
          <ul className="mt-4 space-y-1 text-sm text-cream-100/80">
            <li>Samstag: 09:00 – 12:00 Uhr</li>
            <li>oder nach Vereinbarung</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-cream-100/10 py-5">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-cream-100/60 sm:flex-row">
          <span>© {new Date().getFullYear()} Bee Swiss. Alle Rechte vorbehalten.</span>
          <Link href="/admin/login" className="hover:text-honey-300">
            Admin
          </Link>
        </Container>
      </div>
    </footer>
  );
}
