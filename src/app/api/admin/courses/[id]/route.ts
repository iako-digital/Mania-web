export const dynamic = 'force-static';
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { readContent, writeContent } from "@/lib/content/store";
import type { Course } from "@/lib/courses/types";

const FILE = "courses.json";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const courses = await readContent<Course[]>(FILE);
  const course = courses.find((c) => c.id === id);
  if (!course) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ course });
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

  const courses = await readContent<Course[]>(FILE);
  const index = courses.findIndex((c) => c.id === id);
  if (index < 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const patch = (body ?? {}) as Partial<Course>;
  const updated: Course = { ...courses[index], ...patch, id, updatedAt: new Date().toISOString() };
  courses[index] = updated;
  await writeContent(FILE, courses);

  return NextResponse.json({ course: updated });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const courses = await readContent<Course[]>(FILE);
  const filtered = courses.filter((c) => c.id !== id);
  if (filtered.length === courses.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeContent(FILE, filtered);

  return NextResponse.json({ ok: true });
}
