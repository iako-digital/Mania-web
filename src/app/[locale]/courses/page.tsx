import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CourseCard } from "@/components/shop/CourseCard";
import { staggerChildren } from "@/lib/motion/variants";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { getPublishedCourses } from "@/lib/courses/queries";

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "courses" });
  const courses = await getPublishedCourses();

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <SectionHeading kicker="Courses" title={t("title")} subtitle={t("subtitle")} />

      <RevealOnScroll variants={staggerChildren} className="mt-14">
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-text-muted">{t("empty")}</p>
        )}
      </RevealOnScroll>
    </div>
  );
}
