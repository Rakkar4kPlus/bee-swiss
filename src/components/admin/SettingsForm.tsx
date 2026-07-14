"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export type SettingsValues = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  usp1Title: string;
  usp1Text: string;
  usp2Title: string;
  usp2Text: string;
  usp3Title: string;
  usp3Text: string;
  ctaTitle: string;
  ctaText: string;
  aboutTitle: string;
  aboutText: string;
  contactIntro: string;
  contactEmail: string;
  contactAddress: string;
  openingHours: string;
  footerTagline: string;
};

const FIELD_KEYS: (keyof SettingsValues)[] = [
  "heroEyebrow",
  "heroTitle",
  "heroSubtitle",
  "usp1Title",
  "usp1Text",
  "usp2Title",
  "usp2Text",
  "usp3Title",
  "usp3Text",
  "ctaTitle",
  "ctaText",
  "aboutTitle",
  "aboutText",
  "contactIntro",
  "contactEmail",
  "contactAddress",
  "openingHours",
  "footerTagline",
];

function Field({
  name,
  label,
  defaultValue,
  multiline,
  rows = 3,
}: {
  name: string;
  label: string;
  defaultValue: string;
  multiline?: boolean;
  rows?: number;
}) {
  const className =
    "w-full rounded-xl border border-honey-200 bg-cream-50 px-4 py-3 text-ink-900 outline-none focus:border-honey-500";
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink-800">
        {label}
      </label>
      {multiline ? (
        <textarea id={name} name={name} defaultValue={defaultValue} rows={rows} className={className} />
      ) : (
        <input id={name} name={name} type="text" defaultValue={defaultValue} className={className} />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-cream-50 p-6 shadow-sm ring-1 ring-honey-200/60">
      <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function SettingsForm({ settings }: { settings: SettingsValues }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    const data = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    for (const key of FIELD_KEYS) {
      payload[key] = String(data.get(key) ?? "");
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Speichern fehlgeschlagen.");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section title="Startseite — Hero">
        <Field name="heroEyebrow" label="Kicker (kleine Zeile über der Überschrift)" defaultValue={settings.heroEyebrow} />
        <Field name="heroTitle" label="Überschrift" defaultValue={settings.heroTitle} multiline rows={2} />
        <Field name="heroSubtitle" label="Untertext" defaultValue={settings.heroSubtitle} multiline />
      </Section>

      <Section title="Startseite — Vorteile (3 Kacheln)">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-3">
            <Field name="usp1Title" label="Titel 1" defaultValue={settings.usp1Title} />
            <Field name="usp1Text" label="Text 1" defaultValue={settings.usp1Text} multiline rows={3} />
          </div>
          <div className="space-y-3">
            <Field name="usp2Title" label="Titel 2" defaultValue={settings.usp2Title} />
            <Field name="usp2Text" label="Text 2" defaultValue={settings.usp2Text} multiline rows={3} />
          </div>
          <div className="space-y-3">
            <Field name="usp3Title" label="Titel 3" defaultValue={settings.usp3Title} />
            <Field name="usp3Text" label="Text 3" defaultValue={settings.usp3Text} multiline rows={3} />
          </div>
        </div>
      </Section>

      <Section title="Startseite — Aufruf am Seitenende">
        <Field name="ctaTitle" label="Überschrift" defaultValue={settings.ctaTitle} />
        <Field name="ctaText" label="Text" defaultValue={settings.ctaText} multiline />
      </Section>

      <Section title="Über uns">
        <Field name="aboutTitle" label="Überschrift" defaultValue={settings.aboutTitle} />
        <Field
          name="aboutText"
          label="Text (Absätze durch eine Leerzeile trennen)"
          defaultValue={settings.aboutText}
          multiline
          rows={10}
        />
      </Section>

      <Section title="Kontakt & Footer">
        <Field name="contactIntro" label="Einleitungstext auf der Kontaktseite" defaultValue={settings.contactIntro} multiline />
        <Field name="contactEmail" label="Angezeigte E-Mail-Adresse" defaultValue={settings.contactEmail} />
        <Field name="contactAddress" label="Standort (z.B. „Basel, Schweiz“)" defaultValue={settings.contactAddress} />
        <Field name="openingHours" label="Öffnungszeiten" defaultValue={settings.openingHours} />
        <Field name="footerTagline" label="Footer-Beschreibungstext" defaultValue={settings.footerTagline} multiline />
      </Section>

      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-green-700">Gespeichert.</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-honey-500 px-6 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-honey-600 disabled:opacity-60"
      >
        {loading ? "Wird gespeichert…" : "Änderungen speichern"}
      </button>
    </form>
  );
}
