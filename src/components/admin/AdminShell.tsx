"use client";

import { useState, ReactNode } from "react";
import { AdminNav } from "./AdminNav";

export function AdminShell({
  adminName,
  children,
}: {
  adminName: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-100 md:flex">
      <div className="flex items-center justify-between bg-ink-900 px-4 py-3 md:hidden">
        <span className="font-display text-lg font-semibold text-cream-50">Bee Swiss</span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-cream-100"
          aria-label="Menü"
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

      {open && (
        <div className="bg-ink-900 p-4 md:hidden">
          <AdminNav adminName={adminName} />
        </div>
      )}

      <aside className="hidden w-64 flex-shrink-0 bg-ink-900 p-5 md:block">
        <AdminNav adminName={adminName} />
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
