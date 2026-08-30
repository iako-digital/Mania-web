import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PatternCategoryFilter } from "@/components/shop/PatternCategoryFilter";
import { PatternCard } from "@/components/shop/PatternCard";
import { staggerChildren } from "@/lib/motion/variants";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { getPatternCategories, getPublishedPatterns } from "@/lib/patterns/queries";

export default async function PatternShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "patternShop" });
  const [categories, patterns] = await Promise.all([getPatternCategories(), getPublishedPatterns(category)]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <SectionHeading kicker="Pattern Shop" title={t("title")} subtitle={t("subtitle")} />

      <div className="mt-12">
        <PatternCategoryFilter locale={locale} categories={categories} active={category} />
      </div>

      <RevealOnScroll variants={staggerChildren} className="mt-14">
        {patterns.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {patterns.map((pattern) => (
              <PatternCard key={pattern.id} pattern={pattern} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-text-muted">{t("empty")}</p>
        )}
      </RevealOnScroll>
    </div>
  );
}
