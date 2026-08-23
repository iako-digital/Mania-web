import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Portrait } from "@/components/about/Portrait";
import { AchievementsBlock } from "@/components/about/AchievementsBlock";
import { SkillsGrid } from "@/components/expertise/SkillsGrid";
import { getAboutContent, getSkills } from "@/lib/content/queries";
import { pickLocale } from "@/lib/content/locale";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });
  const [about, skills] = await Promise.all([getAboutContent(), getSkills()]);

  const bio = pickLocale(about.bio, locale);
  const career = pickLocale(about.careerNarrative, locale);
  const achievements = pickLocale(about.achievementsNarrative, locale);
  const programs = about.programs.length > 0 ? about.programs : ["Gerber AccuMark"];

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <SectionHeading kicker={t("roleLabel")} title={t("title")} />

      <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
        <Portrait portraitUrl={about.portraitUrl} />

        <div className="flex flex-col gap-16">
          <RevealOnScroll>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">{t("bioTitle")}</p>
            <p className="mt-4 text-lg leading-relaxed text-text-primary md:text-xl">{bio}</p>
          </RevealOnScroll>

          <RevealOnScroll>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">{t("careerTitle")}</p>
            <p className="mt-4 leading-relaxed text-text-muted">{career}</p>
          </RevealOnScroll>

          <AchievementsBlock locale={locale} narrative={achievements} />
        </div>
      </div>

      <section className="mt-28">
        <h2 className="font-display text-2xl text-text-primary md:text-3xl">{t("skillsTitle")}</h2>
        <div className="mt-10">
          <SkillsGrid skills={skills} />
        </div>
      </section>

      <section className="mt-20">
        <h2 className="font-display text-2xl text-text-primary md:text-3xl">{t("programsTitle")}</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {programs.map((program) => (
            <span
              key={program}
              className="border border-hairline px-4 py-2 font-mono text-xs uppercase tracking-widest text-text-primary"
            >
              {program}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
