import { NextResponse } from "next/server";
import { getCourseById, getEnrollment } from "@/lib/courses/queries";
import { getCurrentStudent } from "@/lib/auth/current-student";
import { callGemini } from "@/lib/gemini";
import type { QuizQuestion } from "@/lib/quiz/types";

const QUESTION_COUNT = 5;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ქვიზი დროებით მიუწვდომელია (GEMINI_API_KEY არ არის კონფიგურირებული)." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { courseId, locale } = (body ?? {}) as Record<string, unknown>;
  if (typeof courseId !== "string" || !courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }
  const quizLocale = locale === "en" ? "en" : "ka";

  const student = await getCurrentStudent();
  const [course, enrollment] = await Promise.all([getCourseById(courseId), getEnrollment(courseId, student.id)]);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }
  if (!enrollment || enrollment.accessRevoked) {
    return NextResponse.json({ error: "ამ კურსზე წვდომა არ გაქვთ." }, { status: 403 });
  }

  // Includes both locale versions as source material regardless of which
  // language the quiz will be written in — richer grounding either way.
  const lessonLines: string[] = [];
  for (const section of course.sections) {
    for (const lesson of section.lessons) {
      lessonLines.push([lesson.title.ka, lesson.title.en].filter(Boolean).join(" / "));
      const body = [lesson.articleBody?.ka, lesson.articleBody?.en].filter(Boolean).join("\n");
      if (body) lessonLines.push(body.slice(0, 3000));
    }
  }
  const knowledgeBase = [course.aiTutor?.knowledgeBase?.ka, course.aiTutor?.knowledgeBase?.en].filter(Boolean).join("\n");
  const description = [course.description.ka, course.description.en].filter(Boolean).join("\n");
  const material = [description, ...lessonLines, knowledgeBase].filter(Boolean).join("\n");

  const courseTitle = [course.title.ka, course.title.en].filter(Boolean).join(" / ");
  const languageInstruction =
    quizLocale === "en" ? "Write the quiz in English." : "დაწერე ქვიზი ქართულად.";
  const prompt = `შეადგინე ${QUESTION_COUNT} ტესტის კითხვა (4 ვარიანტით თითოეულს) კურსის „${courseTitle}“ მასალაზე დაყრდნობით. ${languageInstruction} მასალა:\n\n${material.slice(0, 8000)}\n\nუპასუხე მხოლოდ JSON მასივით, ყოველ ელემენტს ეს ველები უნდა ჰქონდეს: question (string), options (4 string-ის მასივი), correctIndex (0-3), explanation (string, მოკლე ახსნა). არაფერი დაწერო JSON-ის გარდა.`;

  try {
    const raw = await callGemini({
      apiKey,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Unexpected quiz shape");

    const questions: QuizQuestion[] = parsed
      .filter(
        (q) =>
          q &&
          typeof q.question === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.correctIndex === "number",
      )
      .map((q) => ({
        question: q.question,
        options: q.options.map(String),
        correctIndex: q.correctIndex,
        explanation: typeof q.explanation === "string" ? q.explanation : undefined,
      }));

    if (questions.length === 0) throw new Error("No valid questions generated");

    return NextResponse.json({ questions });
  } catch (err) {
    console.error("[ai-tutor/quiz] generation error:", err);
    return NextResponse.json({ error: "ქვიზის შექმნა ვერ მოხერხდა." }, { status: 502 });
  }
}
