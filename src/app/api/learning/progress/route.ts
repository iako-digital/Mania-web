import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/content/store";
import { getCurrentStudent } from "@/lib/auth/current-student";
import type { Enrollment } from "@/lib/courses/types";

const FILE = "enrollments.json";

export async function GET(request: Request) {
  const courseId = new URL(request.url).searchParams.get("courseId");
  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  const student = await getCurrentStudent();
  const enrollments = await readContent<Enrollment[]>(FILE);
  const enrollment = enrollments.find((e) => e.courseId === courseId && e.studentId === student.id);

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

  const student = await getCurrentStudent();
  const enrollments = await readContent<Enrollment[]>(FILE);
  let enrollment = enrollments.find((e) => e.courseId === courseId && e.studentId === student.id);
  const now = new Date().toISOString();

  if (!enrollment) {
    enrollment = {
      id: randomUUID(),
      courseId,
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
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
