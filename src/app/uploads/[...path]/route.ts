import { NextResponse } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { getUploadDir, contentTypeForExtension } from "@/lib/uploads";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/uploads/[...path]">
) {
  const { path: segments } = await ctx.params;

  if (segments.some((segment) => segment.includes("..") || segment.includes("\\"))) {
    return NextResponse.json({ error: "Ungültiger Pfad." }, { status: 400 });
  }

  const uploadDir = getUploadDir();
  const filePath = path.join(uploadDir, ...segments);

  if (!filePath.startsWith(path.resolve(uploadDir))) {
    return NextResponse.json({ error: "Ungültiger Pfad." }, { status: 400 });
  }

  try {
    const stats = await stat(filePath);
    if (!stats.isFile()) throw new Error("not a file");

    const buffer = await readFile(filePath);
    const contentType = contentTypeForExtension(path.extname(filePath));

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(stats.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Bild nicht gefunden." }, { status: 404 });
  }
}
