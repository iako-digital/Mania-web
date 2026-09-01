import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { readContent, writeContent } from "@/lib/content/store";
import type { Course } from "@/lib/courses/types";

const FILE = "courses.json";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const courses = await readContent<Course[]>(FILE);
  return NextResponse.json({ courses });
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

  const { title, slug } = (body ?? {}) as Record<string, unknown>;
  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const course: Course = {
    id: randomUUID(),
    slug: typeof slug === "string" && slug.trim() ? slug.trim() : title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: { ka: title.trim(), en: "" },
    subtitle: { ka: "", en: "" },
    description: { ka: "", en: "" },
    coverImageUrl: "",
    instructorName: "",
    price: 0,
    currency: "GEL",
    published: false,
    format: "on_demand",
    sections: [],
    createdAt: now,
    updatedAt: now,
  };

  const courses = await readContent<Course[]>(FILE);
  courses.push(course);
  await writeContent(FILE, courses);

  return NextResponse.json({ course }, { status: 201 });
}




export const dynamic = 'force-dynamic';
