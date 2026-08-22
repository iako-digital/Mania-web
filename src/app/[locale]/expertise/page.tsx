import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkflowRail } from "@/components/expertise/WorkflowRail";
import { SkillsGrid } from "@/components/expertise/SkillsGrid";
import { ProgramBadge } from "@/components/expertise/ProgramBadge";
import { getSkills, getWorkflowSteps } from "@/lib/sanity/queries";
import type { SkillData, WorkflowStepData } from "@/lib/sanity/types";

const STEP_KEYS = ["concept", "pattern", "grading", "optimization", "cutting"] as const;

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "expertise" });

  const [stepsFromCms, skillsFromCms] = await Promise.all([getWorkflowSteps(), getSkills()]);

  const steps: WorkflowStepData[] =
    stepsFromCms.length > 0
      ? stepsFromCms
      : STEP_KEYS.map((key) => ({
          _id: key,
          title: {
            ka: t(`steps.${key}.title`),
            en: t(`steps.${key}.title`),
          },
          description: {
            ka: t(`steps.${key}.description`),
            en: t(`steps.${key}.description`),
          },
        }));

  const skillsListFallback = t.raw("skillsList") as string[];
  const skills: SkillData[] =
    skillsFromCms.length > 0
      ? skillsFromCms
      : skillsListFallback.map((label, i) => ({
          _id: String(i),
          label: { ka: label, en: label },
        }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <SectionHeading kicker="Expertise" title={t("title")} subtitle={t("subtitle")} />

      <section className="mt-20">
        <h2 className="font-display text-2xl text-text-primary md:text-3xl">{t("processTitle")}</h2>
        <p className="mt-2 max-w-lg text-text-muted">{t("processSubtitle")}</p>
        <div className="mt-12">
          <WorkflowRail steps={steps} />
        </div>
      </section>

      <section className="mt-28">
        <h2 className="font-display text-2xl text-text-primary md:text-3xl">{t("skillsTitle")}</h2>
        <p className="mt-2 max-w-lg text-text-muted">{t("skillsSubtitle")}</p>
        <div className="mt-12">
          <SkillsGrid skills={skills} />
        </div>
      </section>

      <section className="mt-28">
        <ProgramBadge locale={locale} />
      </section>
    </div>
  );
}
