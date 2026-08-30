import { randomUUID } from "crypto";
import { readContent, writeContent } from "@/lib/content/store";
import type { Course, Enrollment } from "./types";

export async function getCourses(): Promise<Course[]> {
  return readContent<Course[]>("courses.json");
}

export async function getPublishedCourses(): Promise<Course[]> {
  const courses = await getCourses();
  return courses.filter((course) => course.published);
}

export async function getCourseById(id: string): Promise<Course | null> {
  const courses = await getCourses();
  return courses.find((course) => course.id === id) ?? null;
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const courses = await getCourses();
  return courses.find((course) => course.slug === slug) ?? null;
}

export async function getEnrollments(): Promise<Enrollment[]> {
  return readContent<Enrollment[]>("enrollments.json");
}

export async function getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
  const enrollments = await getEnrollments();
  return enrollments.filter((e) => e.studentId === studentId);
}

export async function getEnrollment(courseId: string, studentId: string): Promise<Enrollment | null> {
  const enrollments = await getEnrollments();
  return enrollments.find((e) => e.courseId === courseId && e.studentId === studentId) ?? null;
}

export async function saveEnrollments(enrollments: Enrollment[]): Promise<void> {
  await writeContent("enrollments.json", enrollments);
}

export async function grantCourseAccess(
  courseId: string,
  studentId: string,
  studentName: string,
  studentEmail: string,
): Promise<void> {
  const enrollments = await getEnrollments();
  const now = new Date().toISOString();
  const existing = enrollments.find((e) => e.courseId === courseId && e.studentId === studentId);

  if (existing) {
    existing.accessRevoked = false;
  } else {
    enrollments.push({
      id: randomUUID(),
      courseId,
      studentId,
      studentName,
      studentEmail,
      completedLessonIds: [],
      enrolledAt: now,
      lastActivityAt: now,
      accessRevoked: false,
    });
  }

  await saveEnrollments(enrollments);
}
