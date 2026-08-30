"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { readContent } from "@/lib/content/store";
import { upsertItem } from "@/lib/content/collections";
import { generateTabebaDraftLesson } from "@/lib/draft-lessons/generate";
import { getDraftLesson, removeDraftLesson, updateDraftLesson } from "@/lib/draft-lessons/queries";
import type { DraftLesson } from "@/lib/draft-lessons/types";
import type { Course, Lesson } from "@/lib/courses/types";

const COURSES_FILE = "courses.json";
const DAILY_SECTION_ID = "section-daily-tabeba";
const DAILY_SECTION_TITLE = { ka: "დღიური გაკვეთილები (Tabeba)", en: "Daily Lessons (Tabeba)" };

export async function generateNow(): Promise<void> {
  await generateTabebaDraftLesson();
  revalidatePath("/admin/pending-courses");
}

export async function updateDraft(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (!id) return;

  await updateDraftLesson(id, {
    title: { ka: String(formData.get("title_ka") || ""), en: String(formData.get("title_en") || "") },
    materialsNeeded: {
      ka: String(formData.get("materialsNeeded_ka") || ""),
      en: String(formData.get("materialsNeeded_en") || ""),
    },
    stepByStepGuide: {
      ka: String(formData.get("stepByStepGuide_ka") || ""),
      en: String(formData.get("stepByStepGuide_en") || ""),
    },
    patternNotes: {
      ka: String(formData.get("patternNotes_ka") || ""),
      en: String(formData.get("patternNotes_en") || ""),
    },
  });

  revalidatePath("/admin/pending-courses");
}

export async function deleteDraft(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (id) await removeDraftLesson(id);
  revalidatePath("/admin/pending-courses");
}

function formatQuizForArticle(draft: DraftLesson, locale: "ka" | "en"): string {
  const heading = locale === "ka" ? "სწრაფი ქვიზი" : "Quick quiz";
  const correctLabel = locale === "ka" ? "სწორი პასუხი" : "Correct answer";
  const lines = draft.quiz.map((q, i) => {
    const options = q.options.map((o, oi) => `${oi + 1}. ${o[locale]}`).join("\n");
    const explanation = q.explanation?.[locale] ? `\n${q.explanation[locale]}` : "";
    return `${i + 1}. ${q.question[locale]}\n${options}\n${correctLabel}: ${q.options[q.correctIndex][locale]}${explanation}`;
  });
  return `${heading}:\n\n${lines.join("\n\n")}`;
}

// Turns an approved draft into a real, immediately-visible Lesson on
// Tabeba's course (in a dedicated "Daily Lessons" section, created on first
// approval), then marks the draft "published" — it stops showing in the
// pending queue (getPendingDraftLessons filters to status "draft") but the
// record itself is kept rather than deleted, as a small history.
export async function approveDraft(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const draft = await getDraftLesson(id);
  if (!draft) return;

  const courses = await readContent<Course[]>(COURSES_FILE);
  const course = courses.find((c) => c.id === draft.courseId);
  if (!course) return;

  let section = course.sections.find((s) => s.id === DAILY_SECTION_ID);
  if (!section) {
    section = { id: DAILY_SECTION_ID, order: course.sections.length, title: DAILY_SECTION_TITLE, lessons: [] };
    course.sections.push(section);
  }

  const materialsHeading = { ka: "საჭირო მასალები", en: "Materials needed" };
  const guideHeading = { ka: "ნაბიჯ-ნაბიჯ ინსტრუქცია", en: "Step-by-step guide" };
  const notesHeading = { ka: "თარგის რჩევები", en: "Pattern notes" };

  const lesson: Lesson = {
    id: randomUUID(),
    order: section.lessons.length,
    title: draft.title,
    type: "article",
    articleBody: {
      ka: [
        `${materialsHeading.ka}:\n${draft.materialsNeeded.ka}`,
        `${guideHeading.ka}:\n${draft.stepByStepGuide.ka}`,
        `${notesHeading.ka}:\n${draft.patternNotes.ka}`,
        formatQuizForArticle(draft, "ka"),
      ].join("\n\n"),
      en: [
        `${materialsHeading.en}:\n${draft.materialsNeeded.en}`,
        `${guideHeading.en}:\n${draft.stepByStepGuide.en}`,
        `${notesHeading.en}:\n${draft.patternNotes.en}`,
        formatQuizForArticle(draft, "en"),
      ].join("\n\n"),
    },
    isPreview: false,
  };

  section.lessons.push(lesson);
  course.updatedAt = new Date().toISOString();

  await upsertItem<Course>(COURSES_FILE, course);
  await updateDraftLesson(id, { status: "published" });

  revalidatePath("/admin/pending-courses");
  revalidatePath("/admin/courses");
  revalidatePath("/learning/[courseId]", "page");
}
