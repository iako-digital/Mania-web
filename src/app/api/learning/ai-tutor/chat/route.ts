import { NextResponse } from "next/server";
import { getCourseById, getEnrollment } from "@/lib/courses/queries";
import { getCurrentStudent } from "@/lib/auth/current-student";
import { callGemini, isGeminiTurn } from "@/lib/gemini";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_TURNS = 12;

function buildSystemInstruction(course: NonNullable<Awaited<ReturnType<typeof getCourseById>>>): string {
  const parts = [
    `შენ ხარ AI ინსტრუქტორი კურსისთვის „${course.title.ka || course.title.en}“. უპასუხე მხოლოდ ამ კურსის მასალაზე დაყრდნობით, ქართულად, გასაგებად და მოკლედ. თუ კითხვა კურსის თემას არ ეხება, თავაზიანად აუხსენი, რომ პასუხობ მხოლოდ ამ კურსთან დაკავშირებულ კითხვებზე.`,
    course.description.ka || course.description.en ? `კურსის აღწერა:\n${course.description.ka || course.description.en}` : "",
  ];

  const lessonLines: string[] = [];
  for (const section of course.sections) {
    lessonLines.push(`სექცია: ${section.title.ka || section.title.en}`);
    for (const lesson of section.lessons) {
      lessonLines.push(`- ${lesson.title.ka || lesson.title.en}`);
      if (lesson.articleBody?.ka || lesson.articleBody?.en) {
        lessonLines.push(`  ${(lesson.articleBody.ka || lesson.articleBody.en).slice(0, 1500)}`);
      }
    }
  }
  if (lessonLines.length > 0) {
    parts.push(`კურსის სილაბუსი და მასალა:\n${lessonLines.join("\n")}`);
  }

  const knowledgeBase = course.aiTutor?.knowledgeBase?.ka || course.aiTutor?.knowledgeBase?.en;
  if (knowledgeBase) {
    parts.push(`დამატებითი ცოდნის ბაზა:\n${knowledgeBase}`);
  }

  return parts.filter(Boolean).join("\n\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI ინსტრუქტორი დროებით მიუწვდომელია (GEMINI_API_KEY არ არის კონფიგურირებული)." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { courseId, message, history } = (body ?? {}) as Record<string, unknown>;
  if (typeof courseId !== "string" || !courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const student = await getCurrentStudent();
  const [course, enrollment] = await Promise.all([getCourseById(courseId), getEnrollment(courseId, student.id)]);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }
  if (!enrollment || enrollment.accessRevoked) {
    return NextResponse.json({ error: "ამ კურსზე წვდომა არ გაქვთ." }, { status: 403 });
  }

  const trimmedMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH);
  const priorTurns = Array.isArray(history) ? history.filter(isGeminiTurn).slice(-MAX_HISTORY_TURNS) : [];

  try {
    const reply = await callGemini({
      apiKey,
      systemInstruction: buildSystemInstruction(course),
      contents: [
        ...priorTurns.map((turn) => ({ role: turn.role, parts: [{ text: turn.text.slice(0, MAX_MESSAGE_LENGTH) }] })),
        { role: "user" as const, parts: [{ text: trimmedMessage }] },
      ],
    });
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[ai-tutor/chat] Gemini request error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "ქსელის შეცდომა." }, { status: 502 });
  }
}
