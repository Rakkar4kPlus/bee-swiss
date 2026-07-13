"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/admin", label: "Übersicht", exact: true },
  { href: "/admin/produkte", label: "Produkte" },
  { href: "/admin/kategorien", label: "Kategorien" },
  { href: "/admin/bestellungen", label: "Bestellungen" },
  { href: "/admin/nachrichten", label: "Nachrichten" },
];

export function AdminNav({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="mb-8 px-2">
          <p className="font-display text-lg font-semibold text-cream-50">Bee Swiss</p>
          <p className="text-xs text-cream-100/50">Admin-Bereich</p>
        </div>
        <nav className="space-y-1">
          {LINKS.map((link) => {
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-honey-500 text-cream-50"
                    : "text-cream-100/70 hover:bg-ink-800 hover:text-cream-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 px-2">
        <p className="text-xs text-cream-100/50">Angemeldet als</p>
        <p className="text-sm text-cream-100">{adminName}</p>
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-xs text-honey-300 hover:underline">
            Zur Website →
          </Link>
          <button
            onClick={async () => {
              setLoading(true);
              await fetch("/api/admin/logout", { method: "POST" });
              router.push("/admin/login");
              router.refresh();
            }}
            disabled={loading}
            className="rounded-full border border-cream-100/20 px-4 py-2 text-xs font-medium text-cream-100 hover:bg-ink-800 disabled:opacity-60"
          >
            {loading ? "Wird ausgeloggt…" : "Ausloggen"}
          </button>
        </div>
      </div>
    </div>
  );
}
