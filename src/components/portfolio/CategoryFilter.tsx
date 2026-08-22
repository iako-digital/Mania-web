import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/lib/sanity/locale";
import type { CategoryRef } from "@/lib/sanity/types";

export async function CategoryFilter({
  locale,
  categories,
  active,
}: {
  locale: string;
  categories: CategoryRef[];
  active?: string;
}) {
  const t = await getTranslations({ locale, namespace: "portfolio" });

  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/portfolio"
        className={`font-mono text-xs uppercase tracking-[0.2em] px-4 py-2 border transition-colors ${
          !active
            ? "border-gold text-gold"
            : "border-hairline text-text-muted hover:text-text-primary hover:border-text-primary"
        }`}
      >
        {t("allCategories")}
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/portfolio?category=${cat.slug}`}
          className={`font-mono text-xs uppercase tracking-[0.2em] px-4 py-2 border transition-colors ${
            active === cat.slug
              ? "border-gold text-gold"
              : "border-hairline text-text-muted hover:text-text-primary hover:border-text-primary"
          }`}
        >
          {pickLocale(cat.title, locale)}
        </Link>
      ))}
    </div>
  );
}
