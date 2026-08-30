import type { LocaleString } from "@/lib/content/types";

export type LessonType = "video" | "article" | "quiz";

export interface Lesson {
  id: string;
  order: number;
  title: LocaleString;
  type: LessonType;
  durationSeconds?: number;
  bunnyVideoId?: string;
  pdfUrl?: string;
  articleBody?: LocaleString;
  isPreview: boolean;
}

export interface CourseSection {
  id: string;
  order: number;
  title: LocaleString;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: LocaleString;
  subtitle: LocaleString;
  description: LocaleString;
  coverImageUrl: string;
  instructorName: string;
  price: number;
  currency: "GEL" | "USD";
  published: boolean;
  sections: CourseSection[];
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  completedLessonIds: string[];
  enrolledAt: string;
  lastActivityAt: string;
  accessRevoked: boolean;
}
