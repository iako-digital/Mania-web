import { getTranslations } from "next-intl/server";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { CourseCard } from "@/components/shop/CourseCard";
import { staggerChildren } from "@/lib/motion/variants";
import type { Course } from "@/lib/courses/types";

export async function FeaturedCourses({ locale, courses }: { locale: string; courses: Course[] }) {
  const t = await getTranslations({ locale, namespace: "home" });

  if (courses.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 md:py-20 lg:px-10">
      <RevealOnScroll>
        <SectionHeading kicker="Courses" title={t("featuredCoursesTitle")} subtitle={t("featuredCoursesSubtitle")} />
      </RevealOnScroll>

      <RevealOnScroll variants={staggerChildren}>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 md:gap-8 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </RevealOnScroll>

      <div className="mt-8 flex justify-center md:mt-14">
        <Button href="/courses" variant="ghost">
          {t("featuredCoursesCta")}
        </Button>
      </div>
    </section>
  );
}
