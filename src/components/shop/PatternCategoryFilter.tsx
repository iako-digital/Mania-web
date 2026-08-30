import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function PatternCategoryFilter({
  locale,
  categories,
  active,
}: {
  locale: string;
  categories: string[];
  active?: string;
}) {
  const t = await getTranslations({ locale, namespace: "patternShop" });

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/pattern-shop"
        className={`font-mono text-xs uppercase tracking-[0.2em] px-4 py-2 border transition-colors ${
          !active ? "border-gold text-gold" : "border-hairline text-text-muted hover:text-text-primary hover:border-text-primary"
        }`}
      >
        {t("allCategories")}
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/pattern-shop?category=${category}`}
          className={`font-mono text-xs uppercase tracking-[0.2em] px-4 py-2 border transition-colors ${
            active === category
              ? "border-gold text-gold"
              : "border-hairline text-text-muted hover:text-text-primary hover:border-text-primary"
          }`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
