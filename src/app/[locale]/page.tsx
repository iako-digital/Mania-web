import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Hero } from "@/components/home/Hero";
import { IntroStatement } from "@/components/home/IntroStatement";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { FeaturedPatterns } from "@/components/home/FeaturedPatterns";
import { getAboutContent, getFeaturedPortfolioItems, getHeroContent } from "@/lib/content/queries";
import { getPublishedCourses } from "@/lib/courses/queries";
import { getPublishedPatterns } from "@/lib/patterns/queries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [hero, featured, about, courses, patterns] = await Promise.all([
    getHeroContent(),
    getFeaturedPortfolioItems(3),
    getAboutContent(),
    getPublishedCourses(),
    getPublishedPatterns(),
  ]);

  return (
    <>
      <Hero data={hero} />
      <IntroStatement locale={locale} about={about} />
      <FeaturedCourses
        locale={locale}
        courses={[
          {
            category: "ვიდეო ჩანაწერების კურსები",
            description: "Explore our video recorded courses for self-paced learning.",
            courses: courses.filter((course) => course.format === "on_demand"),
          },
          {
            category: "AI მასწავლებელი",
            description: "Learn with the help of an AI mentor for personalized guidance.",
            courses: courses.filter((course) => course.format === "ai_tutor"),
          },
          {
            category: "კონსტრუქტორების კურსები",
            description: "Master pattern construction with our specialized courses.",
            courses: courses.filter((course) => course.format === "live"),
          },
        ]}
      />
      <FeaturedPatterns locale={locale} patterns={patterns.slice(0, 4)} />
      <FeaturedProjects locale={locale} items={featured} />
    </>
  );
}
