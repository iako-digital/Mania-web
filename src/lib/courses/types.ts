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

// The delivery format a course is taught in. "on_demand" (self-paced video)
// is the original/default shape; "live" adds a schedule instead of playable
// curriculum; "ai_tutor" keeps curriculum but centers the Gemini-powered
// tutor/quiz experience over the AiTutor panel. All three share the same
// purchase flow (BuyButton → order → manual-transfer → admin approve).
export type CourseFormat = "on_demand" | "live" | "ai_tutor";

export interface LiveSessionSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface LiveDetails {
  location: LocaleString;
  capacity: number;
  sessions: LiveSessionSlot[];
}

export interface AiTutorSettings {
  enabled: boolean;
  knowledgeBase?: LocaleString;
}

export interface Course {
  id: string;
  slug: string;
  title: LocaleString;
  subtitle: LocaleString;
  description: LocaleString;
  coverImageUrl: string;
  instructorName: string;
  instructorBio?: LocaleString;
  price: number;
  currency: "GEL" | "USD";
  published: boolean;
  format: CourseFormat;
  liveDetails?: LiveDetails;
  aiTutor?: AiTutorSettings;
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
