import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { getCourseById, getEnrollment } from "@/lib/courses/queries";
import { getCurrentStudent } from "@/lib/auth/current-student";
import { VideoPlayer } from "@/components/learning/VideoPlayer";
import { CourseSidebar } from "@/components/learning/CourseSidebar";
import { PlayerTabs } from "@/components/learning/PlayerTabs";
import { OverviewTab } from "@/components/learning/OverviewTab";
import { QATab } from "@/components/learning/QATab";
import { AiTutorPanel } from "@/components/learning/AiTutorPanel";
import { QuizPanel } from "@/components/learning/QuizPanel";
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

  const student = await getCurrentStudent();
  const enrollment = await getEnrollment(courseId, student.id);
  const courseTitle = course.title.ka || course.title.en;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-hairline px-4 py-3 sm:px-6">
        <div>
          <p className="font-display text-lg text-text-primary">{courseTitle}</p>
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{course.instructorName}</p>
        </div>
        <Link href="/" className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold">
          გასვლა
        </Link>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <main className="flex-1">
          {/* "live" courses have a schedule instead of playable curriculum —
              VideoPlayer/CourseSidebar assume lesson-based content, so this
              format gets its own view rather than rendering an empty player. */}
          {course.format === "live" ? (
            <div className="p-6">
              <div className="border border-hairline bg-surface p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-text-muted">ლაივ გაკვეთილის დეტალები</p>
                {course.liveDetails ? (
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-text-primary">
                      <MapPin size={16} className="text-gold" />
                      {course.liveDetails.location.ka || course.liveDetails.location.en}
                    </div>
                    <div className="flex flex-col gap-2">
                      {course.liveDetails.sessions.length > 0 ? (
                        course.liveDetails.sessions.map((s) => (
                          <div key={s.id} className="flex items-center gap-2 text-text-primary">
                            <CalendarDays size={16} className="text-gold" />
                            {s.date} · {s.startTime}–{s.endTime}
                          </div>
                        ))
                      ) : (
                        <p className="text-text-muted">განრიგი მალე გამოქვეყნდება.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-text-muted">ლაივ გაკვეთილის დეტალები ჯერ არ არის დამატებული.</p>
                )}
              </div>
            </div>
          ) : (
            <VideoPlayer lesson={selectedLesson} />
          )}

          <PlayerTabs
            overview={<OverviewTab course={course} lesson={selectedLesson} />}
            qa={<QATab />}
            ai={<AiTutorPanel courseId={course.id} courseTitle={courseTitle} />}
            quiz={<QuizPanel courseId={course.id} />}
          />
        </main>

        {course.format !== "live" && (
          <div className="md:w-96">
            <CourseSidebar
              courseId={course.id}
              sections={sortedSections}
              selectedLessonId={selectedLesson?.id ?? null}
              initialCompletedLessonIds={enrollment?.completedLessonIds ?? []}
            />
          </div>
        )}
      </div>
    </div>
  );
}
