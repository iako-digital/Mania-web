import { setRequestLocale } from "next-intl/server";
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
  params: Promise<{ locale: string }>;
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
      <FeaturedCourses locale={locale} courses={courses.slice(0, 3)} />
      <FeaturedPatterns locale={locale} patterns={patterns.slice(0, 4)} />
      <FeaturedProjects locale={locale} items={featured} />
    </>
  );
}
