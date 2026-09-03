import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { readContent, writeContent } from "@/lib/content/store";
import type { Pattern } from "@/lib/patterns/types";

const FILE = "patterns.json";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const patterns = await readContent<Pattern[]>(FILE);
  const pattern = patterns.find((p) => p.id === id);
  if (!pattern) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ pattern });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const patterns = await readContent<Pattern[]>(FILE);
  const index = patterns.findIndex((p) => p.id === id);
  if (index < 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const patch = (body ?? {}) as Partial<Pattern>;
  const updated: Pattern = { ...patterns[index], ...patch, id, updatedAt: new Date().toISOString() };
  patterns[index] = updated;
  await writeContent(FILE, patterns);

  return NextResponse.json({ pattern: updated });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const patterns = await readContent<Pattern[]>(FILE);
  const filtered = patterns.filter((p) => p.id !== id);
  if (filtered.length === patterns.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeContent(FILE, filtered);

  return NextResponse.json({ ok: true });
}
