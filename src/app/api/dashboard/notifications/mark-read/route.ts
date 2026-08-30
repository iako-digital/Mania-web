import { NextResponse } from "next/server";
import { getCurrentStudent } from "@/lib/auth/current-student";
import { markNotificationRead } from "@/lib/notifications/queries";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { id } = (body ?? {}) as Record<string, unknown>;
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const student = await getCurrentStudent();
  await markNotificationRead(id, student.id);

  return NextResponse.json({ ok: true });
}
