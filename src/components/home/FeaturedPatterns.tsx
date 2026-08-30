import { getTranslations } from "next-intl/server";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PatternCard } from "@/components/shop/PatternCard";
import { staggerChildren } from "@/lib/motion/variants";
import type { Pattern } from "@/lib/patterns/types";

export async function FeaturedPatterns({ locale, patterns }: { locale: string; patterns: Pattern[] }) {
  const t = await getTranslations({ locale, namespace: "home" });

  if (patterns.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 md:py-20 lg:px-10">
      <RevealOnScroll>
        <SectionHeading kicker="Pattern Shop" title={t("featuredPatternsTitle")} subtitle={t("featuredPatternsSubtitle")} />
      </RevealOnScroll>

      <RevealOnScroll variants={staggerChildren}>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 md:gap-8 lg:grid-cols-4">
          {patterns.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </RevealOnScroll>

      <div className="mt-8 flex justify-center md:mt-14">
        <Button href="/pattern-shop" variant="ghost">
          {t("featuredPatternsCta")}
        </Button>
      </div>
    </section>
  );
}
