import type { LocaleString } from "@/lib/content/types";

export type DraftLessonStatus = "draft" | "published";

export interface DraftQuizQuestion {
  question: LocaleString;
  options: LocaleString[];
  correctIndex: number;
  explanation?: LocaleString;
}

export interface DraftLesson {
  id: string;
  courseId: string;
  title: LocaleString;
  materialsNeeded: LocaleString;
  stepByStepGuide: LocaleString;
  patternNotes: LocaleString;
  quiz: DraftQuizQuestion[];
  status: DraftLessonStatus;
  createdAt: string;
}
