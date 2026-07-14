import { prisma } from "@/lib/prisma";

const SETTINGS_ID = "singleton";

/**
 * Liefert die (einzige) Zeile mit den redigierbaren Seiteninhalten. Legt sie
 * beim allerersten Aufruf mit den Standardwerten aus dem Prisma-Schema an,
 * damit die Seite auch ohne Seed-Lauf nie ohne Inhalte dasteht.
 */
export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });
}

export { SETTINGS_ID };
