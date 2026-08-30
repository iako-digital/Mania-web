"use client";

import { useState } from "react";
import { CheckCircle2, Circle, FileText, HelpCircle, PlayCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CourseSection } from "@/lib/courses/types";

const TYPE_ICON = { video: PlayCircle, article: FileText, quiz: HelpCircle } as const;

function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function CourseSidebar({
  courseId,
  sections,
  selectedLessonId,
  initialCompletedLessonIds,
}: {
  courseId: string;
  sections: CourseSection[];
  selectedLessonId: string | null;
  initialCompletedLessonIds: string[];
}) {
  const [completed, setCompleted] = useState(new Set(initialCompletedLessonIds));
  const [pending, setPending] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function toggleCompleted(lessonId: string) {
    const nextCompleted = !completed.has(lessonId);
    setPending(lessonId);
    setCompleted((prev) => {
      const next = new Set(prev);
      if (nextCompleted) next.add(lessonId);
      else next.delete(lessonId);
      return next;
    });

    try {
      await fetch("/api/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, lessonId, completed: nextCompleted }),
      });
    } finally {
      setPending(null);
    }
  }

  function selectLesson(lessonId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lesson", lessonId);
    router.push(`?${params.toString()}`, { scroll: false });
  }

  const totalLessons = sections.reduce((total, s) => total + s.lessons.length, 0);
  const percent = totalLessons > 0 ? Math.round((completed.size / totalLessons) * 100) : 0;

  return (
    <aside className="flex h-full flex-col border-hairline md:border-l">
      <div className="border-b border-hairline p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-text-muted">კურსის შინაარსი</span>
          <span className="font-mono text-xs text-gold">{percent}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-hairline">
          <div className="h-full bg-gold transition-all duration-300" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sections
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div key={section.id} className="border-b border-hairline">
              <p className="bg-surface px-4 py-3 font-display text-sm text-text-primary">
                {section.title.ka || section.title.en}
              </p>
              <ul>
                {section.lessons
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((lesson) => {
                    const Icon = TYPE_ICON[lesson.type];
                    const isSelected = lesson.id === selectedLessonId;
                    const isCompleted = completed.has(lesson.id);
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => selectLesson(lesson.id)}
                          className={
                            "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer " +
                            (isSelected ? "bg-gold/10" : "hover:bg-surface")
                          }
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCompleted(lesson.id);
                            }}
                            disabled={pending === lesson.id}
                            aria-label={isCompleted ? "დასრულებულია" : "დასრულებულად მონიშვნა"}
                            className="shrink-0 text-gold transition-opacity hover:opacity-70 cursor-pointer disabled:opacity-50"
                          >
                            {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} className="text-text-muted" />}
                          </button>
                          <Icon size={15} className="shrink-0 text-text-muted" />
                          <span className={"flex-1 text-sm " + (isSelected ? "text-gold" : "text-text-primary")}>
                            {lesson.title.ka || lesson.title.en}
                          </span>
                          {lesson.durationSeconds && (
                            <span className="shrink-0 font-mono text-[11px] text-text-muted">
                              {formatDuration(lesson.durationSeconds)}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
      </div>
    </aside>
  );
}
