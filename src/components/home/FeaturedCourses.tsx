import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { staggerChildren } from "@/lib/motion/variants";
import { pickLocale } from "@/lib/content/locale";
import type { Course } from "@/lib/courses/types";

export async function FeaturedCourses({ locale, courses }: { locale: string; courses: Course[] }) {
  const t = await getTranslations({ locale, namespace: "home" });

  if (courses.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <RevealOnScroll>
        <SectionHeading kicker="Courses" title={t("featuredCoursesTitle")} subtitle={t("featuredCoursesSubtitle")} />
      </RevealOnScroll>

      <RevealOnScroll variants={staggerChildren}>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const title = pickLocale(course.title, locale);
            return (
              <Link
                key={course.id}
                href={`/learning/${course.id}`}
                className="crop-mark group relative block overflow-hidden border border-hairline bg-surface"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-ink">
                  {course.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.coverImageUrl}
                      alt={title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <GraduationCap size={32} className="text-text-muted/30" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg text-text-primary">{title}</h3>
                  <p className="mt-2 text-gold">
                    {course.price} {course.currency}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </RevealOnScroll>
    </section>
  );
}
