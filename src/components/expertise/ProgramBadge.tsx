import { getTranslations } from "next-intl/server";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export async function ProgramBadge({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "expertise" });

  return (
    <RevealOnScroll className="flex flex-col items-start gap-6 border border-hairline bg-surface p-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">{t("softwareTitle")}</p>
        <p className="mt-3 max-w-xl text-text-muted">{t("softwareBody")}</p>
      </div>
      <span className="font-display text-2xl tracking-tight text-text-primary whitespace-nowrap">
        Gerber AccuMark
      </span>
    </RevealOnScroll>
  );
}
