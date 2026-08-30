import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/content/store";
import { DEMO_STUDENT_EMAIL, DEMO_STUDENT_ID, DEMO_STUDENT_NAME } from "@/lib/courses/demo-student";
import type { Enrollment } from "@/lib/courses/types";

const FILE = "enrollments.json";

export async function GET(request: Request) {
  const courseId = new URL(request.url).searchParams.get("courseId");
  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  const enrollments = await readContent<Enrollment[]>(FILE);
  const enrollment = enrollments.find((e) => e.courseId === courseId && e.studentId === DEMO_STUDENT_ID);

  return NextResponse.json({ completedLessonIds: enrollment?.completedLessonIds ?? [] });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { courseId, lessonId, completed } = (body ?? {}) as Record<string, unknown>;
  if (typeof courseId !== "string" || typeof lessonId !== "string" || typeof completed !== "boolean") {
    return NextResponse.json({ error: "courseId, lessonId and completed are required" }, { status: 400 });
  }

  const enrollments = await readContent<Enrollment[]>(FILE);
  let enrollment = enrollments.find((e) => e.courseId === courseId && e.studentId === DEMO_STUDENT_ID);
  const now = new Date().toISOString();

  if (!enrollment) {
    enrollment = {
      id: randomUUID(),
      courseId,
      studentId: DEMO_STUDENT_ID,
      studentName: DEMO_STUDENT_NAME,
      studentEmail: DEMO_STUDENT_EMAIL,
      completedLessonIds: [],
      enrolledAt: now,
      lastActivityAt: now,
      accessRevoked: false,
    };
    enrollments.push(enrollment);
  }

  const set = new Set(enrollment.completedLessonIds);
  if (completed) {
    set.add(lessonId);
  } else {
    set.delete(lessonId);
  }
  enrollment.completedLessonIds = [...set];
  enrollment.lastActivityAt = now;

  await writeContent(FILE, enrollments);

  return NextResponse.json({ completedLessonIds: enrollment.completedLessonIds });
}
