"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readContent } from "@/lib/content/store";
import { deleteItem, upsertItem } from "@/lib/content/collections";
import { resolveLocaleString } from "@/lib/translate";
import type {
  AiTutorSettings,
  Course,
  CourseFormat,
  CourseSection,
  Lesson,
  LessonType,
  LiveDetails,
} from "@/lib/courses/types";

const FILE = "courses.json";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function loadCourse(id: string): Promise<Course> {
  const courses = await readContent<Course[]>(FILE);
  const course = courses.find((c) => c.id === id);
  if (!course) throw new Error(`Course not found: ${id}`);
  return course;
}

async function saveCourse(course: Course): Promise<void> {
  course.updatedAt = new Date().toISOString();
  await upsertItem<Course>(FILE, course);
  revalidatePath("/learning/[courseId]", "page");
}

function refreshAndRedirect(id: string) {
  revalidatePath(`/admin/courses/${id}/edit`);
  redirect(`/admin/courses/${id}/edit?saved=1`);
}

export async function saveCourseMeta(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "") || randomUUID();
  const slugInput = String(formData.get("slug") || "");
  const isNew = String(formData.get("id") || "") === "";

  const [title, subtitle, description] = await Promise.all([
    resolveLocaleString(String(formData.get("title_ka") || ""), String(formData.get("title_en") || "")),
    resolveLocaleString(String(formData.get("subtitle_ka") || ""), String(formData.get("subtitle_en") || "")),
    resolveLocaleString(
      String(formData.get("description_ka") || ""),
      String(formData.get("description_en") || ""),
    ),
  ]);

  const existing = isNew ? null : await loadCourse(id);
  const now = new Date().toISOString();

  const format: CourseFormat =
    formData.get("format") === "live" || formData.get("format") === "ai_tutor"
      ? (formData.get("format") as CourseFormat)
      : "on_demand";

  let liveDetails: LiveDetails | undefined;
  if (format === "live") {
    const [liveLocation] = await Promise.all([
      resolveLocaleString(String(formData.get("liveLocation_ka") || ""), String(formData.get("liveLocation_en") || "")),
    ]);
    let sessions: LiveDetails["sessions"] = [];
    try {
      const parsed = JSON.parse(String(formData.get("liveSessionsJson") || "[]"));
      if (Array.isArray(parsed)) {
        sessions = parsed
          .filter((s) => s && typeof s.date === "string")
          .map((s) => ({
            id: String(s.id || randomUUID()),
            date: String(s.date || ""),
            startTime: String(s.startTime || ""),
            endTime: String(s.endTime || ""),
          }));
      }
    } catch {
      sessions = existing?.liveDetails?.sessions ?? [];
    }
    liveDetails = {
      location: liveLocation,
      capacity: Number(formData.get("liveCapacity") || 0),
      sessions,
    };
  }

  let aiTutor: AiTutorSettings | undefined;
  if (format === "ai_tutor" || formData.get("aiTutorEnabled") === "on") {
    const knowledgeBase = await resolveLocaleString(
      String(formData.get("aiTutorKnowledgeBase_ka") || ""),
      String(formData.get("aiTutorKnowledgeBase_en") || ""),
    );
    aiTutor = {
      enabled: format === "ai_tutor" || formData.get("aiTutorEnabled") === "on",
      knowledgeBase,
    };
  }

  const course: Course = {
    id,
    slug: slugify(slugInput || title.en) || id.slice(0, 8),
    title,
    subtitle,
    description,
    coverImageUrl: String(formData.get("coverImageUrl") || ""),
    instructorName: String(formData.get("instructorName") || ""),
    price: Number(formData.get("price") || 0),
    currency: formData.get("currency") === "USD" ? "USD" : "GEL",
    published: formData.get("published") === "on",
    format,
    liveDetails,
    aiTutor,
    sections: existing?.sections ?? [],
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await upsertItem<Course>(FILE, course);
  revalidatePath("/learning/[courseId]", "page");
  revalidatePath("/admin/courses");
  redirect(`/admin/courses/${id}/edit?saved=1`);
}

export async function removeCourse(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (id) {
    await deleteItem(FILE, id);
    revalidatePath("/admin/courses");
  }
  redirect("/admin/courses?saved=1");
}

export async function addSection(formData: FormData): Promise<void> {
  const courseId = String(formData.get("courseId") || "");
  const titleKa = String(formData.get("title") || "").trim();
  if (!courseId || !titleKa) redirect(`/admin/courses/${courseId}/edit`);

  const course = await loadCourse(courseId);
  const title = await resolveLocaleString(titleKa, "");

  const section: CourseSection = {
    id: randomUUID(),
    order: course.sections.length,
    title,
    lessons: [],
  };
  course.sections.push(section);
  await saveCourse(course);
  refreshAndRedirect(courseId);
}

export async function removeSection(formData: FormData): Promise<void> {
  const courseId = String(formData.get("courseId") || "");
  const sectionId = String(formData.get("sectionId") || "");
  const course = await loadCourse(courseId);
  course.sections = course.sections.filter((s) => s.id !== sectionId);
  await saveCourse(course);
  refreshAndRedirect(courseId);
}

export async function addLesson(formData: FormData): Promise<void> {
  const courseId = String(formData.get("courseId") || "");
  const sectionId = String(formData.get("sectionId") || "");
  const titleKa = String(formData.get("title") || "").trim();
  const type = String(formData.get("type") || "video") as LessonType;
  if (!courseId || !sectionId || !titleKa) redirect(`/admin/courses/${courseId}/edit`);

  const course = await loadCourse(courseId);
  const section = course.sections.find((s) => s.id === sectionId);
  if (!section) redirect(`/admin/courses/${courseId}/edit`);

  const title = await resolveLocaleString(titleKa, "");
  const lesson: Lesson = {
    id: randomUUID(),
    order: section.lessons.length,
    title,
    type,
    isPreview: false,
  };
  section.lessons.push(lesson);
  await saveCourse(course);
  refreshAndRedirect(courseId);
}

export async function removeLesson(formData: FormData): Promise<void> {
  const courseId = String(formData.get("courseId") || "");
  const sectionId = String(formData.get("sectionId") || "");
  const lessonId = String(formData.get("lessonId") || "");
  const course = await loadCourse(courseId);
  const section = course.sections.find((s) => s.id === sectionId);
  if (section) {
    section.lessons = section.lessons.filter((l) => l.id !== lessonId);
  }
  await saveCourse(course);
  refreshAndRedirect(courseId);
}

export async function saveLessonMedia(formData: FormData): Promise<void> {
  const courseId = String(formData.get("courseId") || "");
  const sectionId = String(formData.get("sectionId") || "");
  const lessonId = String(formData.get("lessonId") || "");

  const course = await loadCourse(courseId);
  const section = course.sections.find((s) => s.id === sectionId);
  const lesson = section?.lessons.find((l) => l.id === lessonId);
  if (!lesson) redirect(`/admin/courses/${courseId}/edit`);

  lesson.bunnyVideoId = String(formData.get("bunnyVideoId") || "");
  lesson.pdfUrl = String(formData.get("pdfUrl") || "");
  lesson.durationSeconds = Number(formData.get("durationSeconds") || 0) || undefined;
  lesson.isPreview = formData.get("isPreview") === "on";

  await saveCourse(course);
  refreshAndRedirect(courseId);
}
