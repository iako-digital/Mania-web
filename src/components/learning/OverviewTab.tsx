import { FileText } from "lucide-react";
import type { Course, Lesson } from "@/lib/courses/types";

export function OverviewTab({ course, lesson }: { course: Course; lesson: Lesson | null }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl text-text-primary">{course.title.ka || course.title.en}</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{course.description.ka || course.description.en}</p>
      </div>

      {lesson && (
        <div className="border-t border-hairline pt-6">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">მიმდინარე გაკვეთილი</p>
          <p className="mt-2 text-text-primary">{lesson.title.ka || lesson.title.en}</p>

          {lesson.pdfUrl && (
            <a
              href={lesson.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 border border-hairline px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:border-gold hover:text-gold"
            >
              <FileText size={14} />
              დამხმარე PDF-ის ჩამოტვირთვა
            </a>
          )}
        </div>
      )}
    </div>
  );
}
