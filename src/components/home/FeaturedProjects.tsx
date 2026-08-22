import { getTranslations } from "next-intl/server";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { staggerChildren } from "@/lib/motion/variants";
import type { PortfolioItemSummary } from "@/lib/sanity/types";

export async function FeaturedProjects({
  locale,
  items,
}: {
  locale: string;
  items: PortfolioItemSummary[];
}) {
  const t = await getTranslations({ locale, namespace: "home" });

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <RevealOnScroll>
        <SectionHeading kicker="02 — Selected Work" title={t("featuredTitle")} subtitle={t("featuredSubtitle")} />
      </RevealOnScroll>

      <RevealOnScroll variants={staggerChildren}>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <ProjectCard key={item._id} item={item} priority={i === 0} />
          ))}
        </div>
      </RevealOnScroll>

      <div className="mt-14 flex justify-center">
        <Button href="/portfolio" variant="ghost">
          {t("featuredAllCta")}
        </Button>
      </div>
    </section>
  );
}
