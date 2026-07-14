# Bee Swiss — Website

Website für die Imkerei Bee Swiss (Basel) mit eingebautem Admin-Bereich zur
Verwaltung von Kategorien, Produkten, Bildern, Bestellanfragen und Kontaktnachrichten.

## Tech-Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Prisma ORM 7](https://www.prisma.io) + SQLite (Datei-Datenbank, kein separater DB-Server nötig)
- Eigene, schlanke Auth-Lösung (bcrypt + signierte Cookies) für Admin- und Kundenkonten

## Lokal starten

Voraussetzung: [Node.js](https://nodejs.org) 20.9 oder neuer.

```bash
npm install
npx prisma migrate dev   # legt die Datenbank an (nur beim ersten Mal / bei Schemaänderungen nötig)
npm run db:seed          # legt Admin-Zugang + Beispielprodukte an
npm run dev
```

Die Seite läuft danach unter [http://localhost:3000](http://localhost:3000).

## Admin-Bereich

Erreichbar unter **/admin/login**. Der initiale Zugang wird beim Seed-Skript
aus der `.env`-Datei angelegt:

```
ADMIN_EMAIL="info@foelsen-honig.ch"
ADMIN_PASSWORD="honig-admin-2026"
```

**Wichtig:** Ändere `ADMIN_PASSWORD` in der `.env` vor dem Live-Gang und führe
danach `npm run db:seed` erneut aus (bestehende Admin-Mails werden aktualisiert,
nicht dupliziert). Im Admin-Bereich kannst du:

- Kategorien anlegen, umbenennen, löschen
- Produkte anlegen, bearbeiten, löschen
- Bilder pro Produkt hochladen, löschen und als Hauptbild festlegen
- Eingegangene Bestellanfragen einsehen und deren Status setzen
- Kontaktformular-Nachrichten einsehen und als gelesen markieren

## E-Mail-Weiterleitung an Gmail

Kontaktanfragen und Bestellanfragen werden **immer** in der Datenbank gespeichert
und sind im Admin-Bereich sichtbar — auch ohne E-Mail-Konfiguration. Zusätzlich
ist der Versand einer Benachrichtigungs-Mail an **nilsfoelsen.swiss@gmail.com**
vorbereitet (`.env`: `SMTP_*` / `CONTACT_NOTIFICATION_EMAIL`). Dafür fehlt noch
ein **Gmail-App-Passwort** (das normale Gmail-Passwort funktioniert aus
Sicherheitsgründen nicht für SMTP):

1. 2-Faktor-Authentifizierung für das Gmail-Konto aktivieren (falls noch nicht
   geschehen): [myaccount.google.com/security](https://myaccount.google.com/security)
2. App-Passwort erstellen: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) —
   App auswählen (z.B. "Mail"), Gerät benennen (z.B. "Bee Swiss Website"),
   erzeugtes 16-stelliges Passwort kopieren.
3. In der `.env`-Datei bei `SMTP_PASSWORD` einfügen (ohne Leerzeichen).
4. Server neu starten (`npm run dev` neu ausführen).

Ohne `SMTP_PASSWORD` wird der Mailversand einfach übersprungen — nichts geht
verloren, die Anfrage bleibt trotzdem im Admin-Bereich sichtbar.

## Wichtige `.env`-Variablen

| Variable | Zweck |
| --- | --- |
| `DATABASE_URL` | Pfad zur SQLite-Datenbankdatei |
| `UPLOAD_DIR` | Ordner für hochgeladene Produktbilder (optional, Standard: `./uploads` im Projekt) — in Produktion auf einen persistenten Pfad setzen |
| `AUTH_SECRET` | Signiert die Login-Sessions — vor dem Live-Gang durch einen eigenen zufälligen Wert ersetzen |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Initialer Admin-Zugang (wird per Seed-Skript angelegt) |
| `SMTP_*`, `CONTACT_NOTIFICATION_EMAIL` | Optionaler Mailversand |

## Bestellungen (Phase 1)

Kunden registrieren sich, legen Produkte in den Warenkorb und senden eine
**Bestellanfrage** (kein Online-Bezahlvorgang). Die Bestellung erscheint im
Admin-Bereich unter „Bestellungen“ — die Zahlungsabwicklung erfolgt manuell
(bar/Überweisung bei Abholung o.ä.). Eine echte Online-Zahlung (z.B. Stripe)
kann in einer späteren Phase ergänzt werden.

## Deployment

Diese App speichert Daten in einer lokalen SQLite-Datei (`dev.db`) und
hochgeladene Produktbilder unter `public/uploads/`. Beides benötigt **persistenten
Speicher** auf dem Server — ein normaler Vercel/Netlify-Serverless-Betrieb
funktioniert dafür **nicht** (siehe Hinweis unten).

### Empfohlen: Render.com (fertig vorbereitet)

Im Projekt liegt eine `render.yaml`, die den kompletten Service beschreibt
(Web-Service + persistentes Disk-Volume für DB und Uploads).

1. **Code zu GitHub pushen** (Repo muss existieren, damit Render darauf zugreifen kann).
2. Auf [render.com](https://render.com) einloggen/registrieren → **New +** →
   **Blueprint** → das GitHub-Repo auswählen. Render erkennt die `render.yaml`
   automatisch und schlägt den Service inkl. 1-GB-Disk vor.
3. Vor dem ersten Deploy im Render-Dashboard unter **Environment** folgende
   Variablen eintragen (in der `render.yaml` als "sync: false" markiert, d.h.
   nicht im Code hinterlegt — du trägst sie direkt bei Render ein):
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
   - `SMTP_HOST` (`smtp.gmail.com`), `SMTP_PORT` (`465`), `SMTP_USER`,
     `SMTP_PASSWORD` (Gmail-App-Passwort), `SMTP_FROM`, `CONTACT_NOTIFICATION_EMAIL`

   `AUTH_SECRET` wird von Render automatisch als sicherer Zufallswert erzeugt,
   `DATABASE_URL` ist bereits korrekt auf das Disk-Volume gesetzt.
4. Deploy starten. Render führt automatisch `npm install`, `npm run build`,
   die Datenbank-Migration und den Start aus (Details in `render.yaml`).
5. **Einmalig nach dem ersten erfolgreichen Deploy**: im Render-Dashboard den
   Tab **Shell** öffnen und `npm run db:seed` ausführen — das legt den
   Admin-Zugang sowie die Start-Kategorien/-Produkte an. Das Seed-Skript
   überschreibt nie bestehende Einträge (siehe `prisma/seed.ts`), du kannst es
   also bei Bedarf gefahrlos erneut ausführen.
6. Eigene Domain verbinden: Render-Dashboard → **Settings** → **Custom Domain**,
   anschliessend beim Domain-Anbieter den dort angezeigten DNS-Eintrag setzen.
   HTTPS wird von Render automatisch eingerichtet.

### Alternative: klassischer vServer/VPS

`npm run build`, dann `npm run start` (z.B. dauerhaft laufend über `pm2`),
davor ein Reverse-Proxy wie nginx oder Caddy für HTTPS. `DATABASE_URL` und der
Uploads-Ordner brauchen dabei nur einen normalen Pfad auf der Server-Festplatte
— kein zusätzliches Setup nötig, da hier ohnehin alles persistent ist.

**Hinweis zu Vercel:** Vercels Serverless-Umgebung hat kein persistentes
Dateisystem — SQLite-Datei und hochgeladene Bilder würden bei jedem Deploy
verloren gehen. Für einen Vercel-Betrieb müsste auf eine gehostete Datenbank
(z.B. Postgres) und einen Objektspeicher (z.B. Vercel Blob) umgestellt werden.
Dank Prisma ist der Datenbankwechsel später unkompliziert möglich.

## Nützliche Befehle

```bash
npm run dev          # Entwicklungsserver
npm run build        # Produktions-Build
npm run start         # Produktions-Server (nach build)
npm run lint          # ESLint
npm run db:migrate    # Neue Migration anlegen/anwenden
npm run db:seed       # Beispieldaten + Admin-Zugang anlegen
npm run db:studio     # Prisma Studio — Datenbank im Browser ansehen/bearbeiten
```
