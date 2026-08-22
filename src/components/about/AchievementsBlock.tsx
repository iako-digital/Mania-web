import { getTranslations } from "next-intl/server";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export async function AchievementsBlock({
  locale,
  narrative,
}: {
  locale: string;
  narrative: string;
}) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <RevealOnScroll className="border-l-2 border-gold py-2 pl-8">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
        {t("achievementsTitle")}
      </p>
      <blockquote className="mt-4 font-display text-2xl leading-snug tracking-tight text-text-primary md:text-3xl">
        {t("achievementsPullQuote")}
      </blockquote>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-muted">{narrative}</p>
    </RevealOnScroll>
  );
}
