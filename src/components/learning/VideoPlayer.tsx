import { FileText, Lock, PlayCircle } from "lucide-react";
import { getBunnyEmbedUrl } from "@/lib/bunny";
import type { Lesson } from "@/lib/courses/types";

// "Protected" here means the embed URL is only ever generated server-side
// from BUNNY_STREAM_LIBRARY_ID + the lesson's bunnyVideoId — the browser
// never sees an API key, and real access control (only render this for an
// enrolled, authenticated student) plugs in around this component once
// student auth exists.
export function VideoPlayer({ lesson }: { lesson: Lesson | null }) {
  const embedUrl = lesson?.type === "video" && lesson.bunnyVideoId ? getBunnyEmbedUrl(lesson.bunnyVideoId) : "";

  // Article-type lessons (text material — used by both the AI Tutor
  // course's own modules and Tabeba's approved daily-draft lessons) have no
  // video by design, not by omission — showing "video not attached" here
  // would be actively misleading rather than just unhelpful.
  const isArticleLesson = lesson?.type === "article";

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-text-muted">
          {isArticleLesson ? (
            <FileText size={40} className="opacity-40" />
          ) : lesson ? (
            <PlayCircle size={40} className="opacity-40" />
          ) : (
            <Lock size={32} className="opacity-40" />
          )}
          <p className="font-mono text-xs uppercase tracking-widest">
            {isArticleLesson
              ? "ტექსტური მასალა — იხილეთ დეტალები ქვემოთ"
              : lesson
                ? "ვიდეო ჯერ არ არის მიბმული"
                : "აირჩიეთ გაკვეთილი"}
          </p>
        </div>
      )}
    </div>
  );
}
