import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { SingleImageUpload } from "@/components/admin/SingleImageUpload";

export const metadata = {
  title: "Inhalte — Admin",
};

export default async function AdminContentPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Inhalte</h1>
      <p className="mt-1 text-sm text-ink-700/70">
        Texte und Bilder auf Startseite, Über-uns- und Kontaktseite bearbeiten.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SingleImageUpload
          field="heroImageUrl"
          label="Hero-Bild (Startseite, grosses Titelbild)"
          currentUrl={settings.heroImageUrl}
          fallbackUrl="/placeholders/hero-banner.svg"
        />
        <SingleImageUpload
          field="aboutImageUrl"
          label="Über-uns-Bild"
          currentUrl={settings.aboutImageUrl}
          fallbackUrl="/placeholders/imker-portrait.svg"
        />
      </div>

      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
