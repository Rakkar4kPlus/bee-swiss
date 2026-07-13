"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "./Container";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/", label: "Start" },
  { href: "/produkte", label: "Produkte" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
];

function BeeMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="var(--color-honey-500)" />
      <g transform="translate(24,26)">
        <ellipse cx="0" cy="0" rx="10" ry="7" fill="#2b2118" />
        <path d="M-10 -3 h20 v2.4 h-20z M-9 1 h18 v2.4 h-18z" fill="#f0c15c" />
        <path d="M-8 -6 c-8 -5 -8 5 0 5z" fill="#fdf8ec" opacity="0.7" />
        <path d="M8 -6 c8 -5 8 5 0 5z" fill="#fdf8ec" opacity="0.7" />
      </g>
    </svg>
  );
}

export function Header({ customerName }: { customerName: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { totalCount } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-honey-200/60 bg-cream-100/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <BeeMark />
          <span className="font-display text-xl font-semibold text-ink-900">
            Bee Swiss
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-honey-600 ${
                pathname === link.href ? "text-honey-600" : "text-ink-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/konto/warenkorb"
            className="relative rounded-full p-2 text-ink-800 hover:bg-honey-100"
            aria-label="Warenkorb"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-honey-500 text-[11px] font-semibold text-cream-50">
                {totalCount}
              </span>
            )}
          </Link>

          <Link
            href={customerName ? "/konto" : "/konto/login"}
            className="hidden rounded-full border border-honey-300 px-4 py-2 text-sm font-medium text-ink-800 hover:bg-honey-100 md:inline-flex"
          >
            {customerName ? customerName.split(" ")[0] : "Login"}
          </Link>

          <button
            className="rounded-full p-2 text-ink-800 hover:bg-honey-100 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menü öffnen"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {open && (
        <nav className="border-t border-honey-200/60 bg-cream-100 md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-base font-medium ${
                  pathname === link.href
                    ? "bg-honey-100 text-honey-700"
                    : "text-ink-800 hover:bg-honey-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={customerName ? "/konto" : "/konto/login"}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-base font-medium text-ink-800 hover:bg-honey-50"
            >
              {customerName ? `Mein Konto (${customerName.split(" ")[0]})` : "Login / Registrieren"}
            </Link>
          </Container>
        </nav>
      )}
    </header>
  );
}
