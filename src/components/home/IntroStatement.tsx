import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { pickLocale } from "@/lib/content/locale";
import type { AboutContent } from "@/lib/content/types";

export async function IntroStatement({
  locale,
  about,
}: {
  locale: string;
  about: AboutContent | null;
}) {
  const t = await getTranslations({ locale, namespace: "home" });
  const body = pickLocale(about?.bio, locale) || t("introBody");

  return (
    <section className="mx-auto max-w-4xl px-6 py-8 md:py-20 lg:px-10">
      <RevealOnScroll>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">01 — Introduction</p>
        <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight md:mt-5 md:text-4xl lg:text-5xl">
          {t("introTitle")}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-text-muted md:mt-8 md:text-xl">{body}</p>
        <div className="mt-6 md:mt-10">
          <Button href="/about" variant="ghost">
            {t("introCta")}
          </Button>
        </div>
      </RevealOnScroll>
    </section>
  );
}
