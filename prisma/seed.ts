import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { slugify } from "../src/lib/slug";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const HONEY_IMAGES = [
  "/placeholders/honey-jar-1.svg",
  "/placeholders/honey-jar-2.svg",
  "/placeholders/honey-jar-3.svg",
  "/placeholders/honey-jar-4.svg",
];

const QUEEN_IMAGES = [
  "/placeholders/queen-bee-1.svg",
  "/placeholders/queen-bee-2.svg",
];

const CATEGORIES = [
  { name: "Honig", position: 0 },
  { name: "Bienenköniginnen", position: 1 },
  { name: "Imkerei Produkte", position: 2 },
];

const products = [
  {
    slug: "waldhonig",
    name: "Waldhonig",
    category: "Honig",
    price: 12.5,
    unit: "500g Glas",
    description:
      "Kräftiger, würziger Waldhonig aus den Wäldern rund um Basel. Dunkel, aromatisch und reich an Mineralstoffen — ideal für herzhafte Gerichte und den Morgentee.",
    image: HONEY_IMAGES[0],
    featured: true,
  },
  {
    slug: "bluetenhonig",
    name: "Blütenhonig",
    category: "Honig",
    price: 10.5,
    unit: "500g Glas",
    description:
      "Milder, blumiger Blütenhonig — unser Klassiker. Cremig-fein im Geschmack, perfekt fürs Frühstücksbrot und zum Süssen.",
    image: HONEY_IMAGES[1],
    featured: true,
  },
  {
    slug: "lindenhonig",
    name: "Lindenhonig",
    category: "Honig",
    price: 13.0,
    unit: "500g Glas",
    description:
      "Erfrischender Lindenhonig mit feiner Menthol-Note. Von unseren Völkern rund um die Basler Lindenalleen gesammelt.",
    image: HONEY_IMAGES[2],
    featured: false,
  },
  {
    slug: "fruehlingshonig",
    name: "Frühlingshonig",
    category: "Honig",
    price: 11.0,
    unit: "500g Glas",
    description:
      "Der erste Honig des Jahres: hell, leicht und blumig-frisch aus der Frühjahrstracht von Raps, Obstblüten und Löwenzahn.",
    image: HONEY_IMAGES[3],
    featured: true,
  },
  {
    slug: "akazienhonig",
    name: "Akazienhonig",
    category: "Honig",
    price: 13.5,
    unit: "500g Glas",
    description:
      "Sehr milder, hell-goldener Honig, der lange flüssig bleibt. Beliebt bei Kindern und zum Süssen von Getränken.",
    image: HONEY_IMAGES[0],
    featured: false,
  },
  {
    slug: "buckfast-koenigin",
    name: "Buckfast-Königin",
    category: "Bienenköniginnen",
    price: 45.0,
    unit: "pro Königin",
    description:
      "Sanftmütige, leistungsstarke Buckfast-Königin aus eigener Nachzucht. Begattet, gezeichnet und geprüft auf Sanftmut, Schwarmträgheit und Honigertrag.",
    image: QUEEN_IMAGES[0],
    featured: true,
  },
  {
    slug: "carnica-koenigin",
    name: "Carnica-Königin",
    category: "Bienenköniginnen",
    price: 45.0,
    unit: "pro Königin",
    description:
      "Reinerbige Carnica-Königin, ruhig und vital. Ideal für Imkerinnen und Imker, die auf die bewährte Kärntner Biene setzen.",
    image: QUEEN_IMAGES[1],
    featured: false,
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "info@bee-swiss.ch";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "honig-admin-2026";
  const adminName = process.env.ADMIN_NAME ?? "Admin";

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: adminName },
  });
  console.log(`Admin-Zugang bereit: ${adminEmail}`);

  // update: {} - Seed ist bewusst "nur anlegen, nie überschreiben": ein erneuter
  // Lauf (z.B. nach einem Deploy) darf Änderungen, die im Admin-Bereich gemacht
  // wurden, niemals zurücksetzen.
  const categoryIdByName = new Map<string, string>();
  for (const c of CATEGORIES) {
    const slug = slugify(c.name);
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { slug, name: c.name, position: c.position },
    });
    categoryIdByName.set(c.name, category.id);
  }
  console.log(`${CATEGORIES.length} Kategorien bereit (bestehende unverändert).`);

  for (const p of products) {
    const categoryId = categoryIdByName.get(p.category);
    if (!categoryId) throw new Error(`Unbekannte Kategorie: ${p.category}`);

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        categoryId,
        price: p.price,
        unit: p.unit,
        description: p.description,
        featured: p.featured,
      },
    });

    const existingImages = await prisma.productImage.count({
      where: { productId: product.id },
    });
    if (existingImages === 0) {
      await prisma.productImage.create({
        data: { productId: product.id, url: p.image, alt: p.name, position: 0 },
      });
    }
  }
  console.log(`${products.length} Produkte bereit (bestehende unverändert).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
