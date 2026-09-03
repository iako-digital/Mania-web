import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { readContent, writeContent } from "@/lib/content/store";
import type { Pattern } from "@/lib/patterns/types";

const FILE = "patterns.json";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const patterns = await readContent<Pattern[]>(FILE);
  return NextResponse.json({ patterns });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, slug, category } = (body ?? {}) as Record<string, unknown>;
  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const pattern: Pattern = {
    id: randomUUID(),
    slug: typeof slug === "string" && slug.trim() ? slug.trim() : title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: { ka: title.trim(), en: "" },
    description: { ka: "", en: "" },
    category: typeof category === "string" ? category : "",
    sizeRange: "",
    difficulty: "intermediate",
    coverImageUrl: "",
    galleryUrls: [],
    pdfUrl: "",
    price: 0,
    currency: "GEL",
    published: false,
    createdAt: now,
    updatedAt: now,
  };

  const patterns = await readContent<Pattern[]>(FILE);
  patterns.push(pattern);
  await writeContent(FILE, patterns);

  return NextResponse.json({ pattern }, { status: 201 });
}
