import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseById, getEnrollment } from "@/lib/courses/queries";
import { DEMO_STUDENT_ID } from "@/lib/courses/demo-student";
import { VideoPlayer } from "@/components/learning/VideoPlayer";
import { CourseSidebar } from "@/components/learning/CourseSidebar";
import { PlayerTabs } from "@/components/learning/PlayerTabs";
import { OverviewTab } from "@/components/learning/OverviewTab";
import { QATab } from "@/components/learning/QATab";
import { AiAssistantPanel } from "@/components/learning/AiAssistantPanel";
import type { Lesson } from "@/lib/courses/types";

export default async function LearningPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const { courseId } = await params;
  const { lesson: lessonParam } = await searchParams;

  const course = await getCourseById(courseId);
  if (!course) notFound();

  const sortedSections = course.sections.slice().sort((a, b) => a.order - b.order);
  const allLessons: Lesson[] = sortedSections.flatMap((s) => s.lessons.slice().sort((a, b) => a.order - b.order));
  const selectedLesson = (lessonParam && allLessons.find((l) => l.id === lessonParam)) || allLessons[0] || null;

  const enrollment = await getEnrollment(courseId, DEMO_STUDENT_ID);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-hairline px-4 py-3 sm:px-6">
        <div>
          <p className="font-display text-lg text-text-primary">{course.title.ka || course.title.en}</p>
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{course.instructorName}</p>
        </div>
        <Link href="/" className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold">
          გასვლა
        </Link>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <main className="flex-1">
          <VideoPlayer lesson={selectedLesson} />
          <PlayerTabs
            overview={<OverviewTab course={course} lesson={selectedLesson} />}
            qa={<QATab />}
            ai={<AiAssistantPanel courseTitle={course.title.ka || course.title.en} />}
          />
        </main>

        <div className="md:w-96">
          <CourseSidebar
            courseId={course.id}
            sections={sortedSections}
            selectedLessonId={selectedLesson?.id ?? null}
            initialCompletedLessonIds={enrollment?.completedLessonIds ?? []}
          />
        </div>
      </div>
    </div>
  );
}
