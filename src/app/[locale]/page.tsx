import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { IntroStatement } from "@/components/home/IntroStatement";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { getAboutPage, getFeaturedPortfolioItems, getHeroSection } from "@/lib/sanity/queries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [hero, featured, about] = await Promise.all([
    getHeroSection(),
    getFeaturedPortfolioItems(3),
    getAboutPage(),
  ]);

  return (
    <>
      <Hero data={hero} />
      <IntroStatement locale={locale} about={about} />
      <FeaturedProjects locale={locale} items={featured} />
    </>
  );
}
