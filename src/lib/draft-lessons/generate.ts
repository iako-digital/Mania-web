import { randomUUID } from "crypto";
import { getCourseById } from "@/lib/courses/queries";
import { callGemini } from "@/lib/gemini";
import { addDraftLesson } from "./queries";
import type { DraftLesson, DraftQuizQuestion } from "./types";

// The only course Tabeba currently teaches — a new course entity per draft
// isn't needed since these are lesson-level drafts appended to her existing
// AI Tutor course once approved (see pending-courses/actions.ts).
export const TABEBA_COURSE_ID = "tabeba-kids-sewing-basics";

const FALLBACK_PERSONA =
  "შენ ხარ ტაბება (Tabeba) — საბავშვო ხაზის AI კონსტრუქტორი და მასწავლებელი, რომელიც ასწავლის საბავშვო ტანსაცმლის ჭრა-კერვას.";

function isLocaleString(value: unknown): value is { ka: string; en: string } {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as Record<string, unknown>).ka === "string" &&
    typeof (value as Record<string, unknown>).en === "string"
  );
}

function isDraftQuizQuestion(value: unknown): value is DraftQuizQuestion {
  if (!value || typeof value !== "object") return false;
  const q = value as Record<string, unknown>;
  return (
    isLocaleString(q.question) &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    q.options.every(isLocaleString) &&
    typeof q.correctIndex === "number" &&
    q.correctIndex >= 0 &&
    q.correctIndex <= 3
  );
}

// Generates one new, original kids'-sewing lesson draft grounded in
// Tabeba's persona (read from the course's own aiTutor.knowledgeBase, so
// updating her persona there automatically flows into future drafts) —
// used both by the admin "Generate Draft Lesson Now" button and the daily
// cron route (src/app/api/cron/generate-daily-tabeba-lesson/route.ts).
export async function generateTabebaDraftLesson(): Promise<DraftLesson> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY არ არის კონფიგურირებული.");
  }

  const course = await getCourseById(TABEBA_COURSE_ID);
  const persona = course?.aiTutor?.knowledgeBase?.ka || FALLBACK_PERSONA;
  const existingTitles = (course?.sections ?? [])
    .flatMap((s) => s.lessons.map((l) => l.title.ka))
    .filter(Boolean);

  const prompt = `${persona}

შექმენი ერთი ახალი, ორიგინალური გაკვეთილი დამწყები მშობლებისა და სტუდენტებისთვის საბავშვო ტანსაცმლის ჭრა-კერვაზე. ის არ უნდა იმეორებდეს უკვე არსებულ გაკვეთილებს: ${existingTitles.join(", ") || "(არცერთი ჯერ არ არსებობს)"}.

დააბრუნე მხოლოდ ერთი JSON ობიექტი, ზუსტად ამ ფორმით (ყველა ტექსტური ველი ორივე ენაზე, ka და en):
{
  "title": {"ka": "გაკვეთილის სათაური", "en": "..."},
  "materialsNeeded": {"ka": "საჭირო ქსოვილებისა და მასალების ჩამონათვალი", "en": "..."},
  "stepByStepGuide": {"ka": "ნაბიჯ-ნაბიჯ ინსტრუქცია ჭრასა და კერვაზე", "en": "..."},
  "patternNotes": {"ka": "თარგის აგების რჩევები", "en": "..."},
  "quiz": [
    {"question": {"ka": "...", "en": "..."}, "options": [{"ka":"...","en":"..."},{"ka":"...","en":"..."},{"ka":"...","en":"..."},{"ka":"...","en":"..."}], "correctIndex": 0, "explanation": {"ka": "...", "en": "..."}}
  ]
}
"quiz" მასივში ზუსტად 3 კითხვა უნდა იყოს. არაფერი დაწერო JSON-ის გარდა.`;

  const raw = await callGemini({
    apiKey,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" },
  });

  const parsed = JSON.parse(raw);
  if (
    !isLocaleString(parsed.title) ||
    !isLocaleString(parsed.materialsNeeded) ||
    !isLocaleString(parsed.stepByStepGuide) ||
    !isLocaleString(parsed.patternNotes) ||
    !Array.isArray(parsed.quiz) ||
    parsed.quiz.length === 0
  ) {
    throw new Error("Gemini-მ არასწორი ფორმატის პასუხი დააბრუნა.");
  }

  const quiz = parsed.quiz.filter(isDraftQuizQuestion) as DraftQuizQuestion[];
  if (quiz.length === 0) {
    throw new Error("ქვიზის კითხვები ვერ დაგენერირდა სწორად.");
  }

  const draft: DraftLesson = {
    id: randomUUID(),
    courseId: TABEBA_COURSE_ID,
    title: parsed.title,
    materialsNeeded: parsed.materialsNeeded,
    stepByStepGuide: parsed.stepByStepGuide,
    patternNotes: parsed.patternNotes,
    quiz,
    status: "draft",
    createdAt: new Date().toISOString(),
  };

  await addDraftLesson(draft);
  return draft;
}
