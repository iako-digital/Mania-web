import { getTranslations } from "next-intl/server";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { staggerChildren } from "@/lib/motion/variants";
import type { PortfolioItemContent } from "@/lib/content/types";

export async function FeaturedProjects({
  locale,
  items,
}: {
  locale: string;
  items: PortfolioItemContent[];
}) {
  const t = await getTranslations({ locale, namespace: "home" });

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 md:py-20 lg:px-10">
      <RevealOnScroll>
        <SectionHeading kicker="02 — Selected Work" title={t("featuredTitle")} subtitle={t("featuredSubtitle")} />
      </RevealOnScroll>

      <RevealOnScroll variants={staggerChildren}>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 md:gap-8 lg:grid-cols-3">
          {items.map((item, i) => (
            <ProjectCard key={item.id} item={item} priority={i === 0} />
          ))}
        </div>
      </RevealOnScroll>

      <div className="mt-8 flex justify-center md:mt-14">
        <Button href="/portfolio" variant="ghost">
          {t("featuredAllCta")}
        </Button>
      </div>
    </section>
  );
}
