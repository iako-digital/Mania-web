import { randomUUID } from "crypto";
import { readContent, writeContent } from "@/lib/content/store";
import type { QuizAttempt } from "./types";

const FILE = "quiz-attempts.json";

export async function getQuizAttempts(): Promise<QuizAttempt[]> {
  return readContent<QuizAttempt[]>(FILE);
}

export async function getStudentQuizAttempts(courseId: string, studentId: string): Promise<QuizAttempt[]> {
  const attempts = await getQuizAttempts();
  return attempts.filter((a) => a.courseId === courseId && a.studentId === studentId);
}

export async function recordQuizAttempt(params: {
  courseId: string;
  studentId: string;
  score: number;
  total: number;
}): Promise<QuizAttempt> {
  const attempts = await getQuizAttempts();
  const attempt: QuizAttempt = {
    id: randomUUID(),
    courseId: params.courseId,
    studentId: params.studentId,
    score: params.score,
    total: params.total,
    submittedAt: new Date().toISOString(),
  };
  attempts.push(attempt);
  await writeContent(FILE, attempts);
  return attempt;
}
