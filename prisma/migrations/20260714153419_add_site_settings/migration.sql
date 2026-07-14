-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "heroEyebrow" TEXT NOT NULL DEFAULT 'Imkerei in Basel',
    "heroTitle" TEXT NOT NULL DEFAULT 'Bee Swiss — naturrein, regional, mit Liebe zur Biene',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Wir sind eine kleine Imkerei in Basel und verkaufen unseren Honig sowie sanftmütige Bienenköniginnen direkt ab Hof.',
    "heroImageUrl" TEXT,
    "usp1Title" TEXT NOT NULL DEFAULT 'Naturrein aus Basel',
    "usp1Text" TEXT NOT NULL DEFAULT 'Unsere Bienenvölker stehen rund um Basel — kurze Wege, volle Frische.',
    "usp2Title" TEXT NOT NULL DEFAULT 'Handwerklich erzeugt',
    "usp2Text" TEXT NOT NULL DEFAULT 'Kaltgeschleudert und schonend abgefüllt, ohne Zusätze.',
    "usp3Title" TEXT NOT NULL DEFAULT 'Direkt vom Imker',
    "usp3Text" TEXT NOT NULL DEFAULT 'Kein Zwischenhandel — du kaufst direkt bei uns, mit Herz für die Biene.',
    "ctaTitle" TEXT NOT NULL DEFAULT 'Fragen zu Honig oder Bienenköniginnen?',
    "ctaText" TEXT NOT NULL DEFAULT 'Melde dich gerne über unser Kontaktformular — wir antworten schnellstmöglich.',
    "aboutTitle" TEXT NOT NULL DEFAULT 'Unsere Imkerei in Basel',
    "aboutText" TEXT NOT NULL DEFAULT 'Bee Swiss ist eine kleine, familiengeführte Imkerei in Basel. Was als Hobby mit wenigen Völkern begann, ist heute eine Leidenschaft, die wir mit Sorgfalt und Respekt vor der Natur betreiben.

Unsere Bienenvölker stehen an sonnigen, blütenreichen Standorten rund um Basel. Wir schleudern unseren Honig kalt und schonend, füllen ihn direkt ab und verzichten bewusst auf jegliche Zusätze — so bleibt der volle, natürliche Geschmack erhalten.

Neben Honig züchten wir auch eigene Bienenköniginnen. Uns ist wichtig, dass unsere Völker sanftmütig, gesund und widerstandsfähig sind — Eigenschaften, die wir bei der Zucht gezielt fördern.

Wir freuen uns, wenn du unsere Produkte probierst — direkt ab Hof, im Onlineshop oder auf Anfrage.',
    "aboutImageUrl" TEXT,
    "contactIntro" TEXT NOT NULL DEFAULT 'Fragen zu Honig, Bienenköniginnen oder einer grösseren Bestellung? Wir freuen uns von dir zu hören.',
    "contactEmail" TEXT NOT NULL DEFAULT 'info@bee-swiss.ch',
    "contactAddress" TEXT NOT NULL DEFAULT 'Basel, Schweiz',
    "openingHours" TEXT NOT NULL DEFAULT 'Hofladen: Samstag 09:00–12:00 Uhr, oder nach Vereinbarung',
    "footerTagline" TEXT NOT NULL DEFAULT 'Naturreiner Honig und Bienenköniginnen direkt vom Imker aus Basel — handwerklich erzeugt, mit Liebe zur Biene.',
    "updatedAt" DATETIME NOT NULL
);
