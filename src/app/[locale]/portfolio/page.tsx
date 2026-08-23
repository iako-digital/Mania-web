import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryFilter } from "@/components/portfolio/CategoryFilter";
import { MasonryGrid } from "@/components/portfolio/MasonryGrid";
import { getCategories, getPortfolioItems } from "@/lib/content/queries";

export default async function PortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "portfolio" });

  const [categories, items] = await Promise.all([getCategories(), getPortfolioItems(category)]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <SectionHeading kicker="Portfolio" title={t("title")} subtitle={t("subtitle")} />

      <div className="mt-12">
        <CategoryFilter locale={locale} categories={categories} active={category} />
      </div>

      <div className="mt-14">
        {items.length > 0 ? (
          <MasonryGrid items={items} />
        ) : (
          <p className="py-20 text-center text-text-muted">{t("empty")}</p>
        )}
      </div>
    </div>
  );
}
