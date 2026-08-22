import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { pickLocale } from "@/lib/sanity/locale";
import type { AboutPageData } from "@/lib/sanity/types";

export async function IntroStatement({
  locale,
  about,
}: {
  locale: string;
  about: AboutPageData | null;
}) {
  const t = await getTranslations({ locale, namespace: "home" });
  const body = pickLocale(about?.bio, locale) || t("introBody");

  return (
    <section className="mx-auto max-w-4xl px-6 py-28 lg:px-10 lg:py-36">
      <RevealOnScroll>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">01 — Introduction</p>
        <h2 className="mt-5 font-display text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl">
          {t("introTitle")}
        </h2>
        <p className="mt-8 text-lg leading-relaxed text-text-muted md:text-xl">{body}</p>
        <div className="mt-10">
          <Button href="/about" variant="ghost">
            {t("introCta")}
          </Button>
        </div>
      </RevealOnScroll>
    </section>
  );
}
