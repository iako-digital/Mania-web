import { NextResponse } from "next/server";
import { getEnrollment } from "@/lib/courses/queries";
import { getCurrentStudent } from "@/lib/auth/current-student";
import { recordQuizAttempt } from "@/lib/quiz/queries";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { courseId, score, total } = (body ?? {}) as Record<string, unknown>;
  if (typeof courseId !== "string" || !courseId || typeof score !== "number" || typeof total !== "number") {
    return NextResponse.json({ error: "courseId, score and total are required" }, { status: 400 });
  }

  const student = await getCurrentStudent();
  const enrollment = await getEnrollment(courseId, student.id);
  if (!enrollment || enrollment.accessRevoked) {
    return NextResponse.json({ error: "ამ კურსზე წვდომა არ გაქვთ." }, { status: 403 });
  }

  const attempt = await recordQuizAttempt({ courseId, studentId: student.id, score, total });
  return NextResponse.json({ attempt });
}
