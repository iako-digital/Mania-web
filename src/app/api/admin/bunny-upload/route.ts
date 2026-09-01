import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { createSignedBunnyUpload } from "@/lib/bunny";

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

  const { title } = (body ?? {}) as Record<string, unknown>;
  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  try {
    const credentials = await createSignedBunnyUpload(title.trim().slice(0, 200));
    return NextResponse.json(credentials);
  } catch (err) {
    console.error("[bunny-upload]", err);
    const message = err instanceof Error ? err.message : "Bunny Stream upload signing failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}




export const dynamic = 'force-dynamic';
