import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { urlForImage } from "@/lib/sanity/image";
import { pickLocale } from "@/lib/sanity/locale";
import { getPortfolioItemBySlug } from "@/lib/sanity/queries";

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [item, t] = await Promise.all([
    getPortfolioItemBySlug(slug),
    getTranslations({ locale, namespace: "portfolio" }),
  ]);

  if (!item) {
    notFound();
  }

  const title = pickLocale(item.title, locale);
  const description = pickLocale(item.description, locale);
  const category = item.category ? pickLocale(item.category.title, locale) : "";
  const occasion = pickLocale(item.occasion, locale);

  return (
    <article className="mx-auto max-w-5xl px-6 py-24 lg:px-10 lg:py-32">
      <Link
        href="/portfolio"
        className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted hover:text-gold transition-colors"
      >
        ← {t("backToPortfolio")}
      </Link>

      <RevealOnScroll className="mt-8">
        {category && (
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">{category}</p>
        )}
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
          {title}
        </h1>

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-2 border-y border-hairline py-6 font-mono text-xs uppercase tracking-widest text-text-muted">
          {item.year && (
            <div>
              <dt className="inline text-text-primary/60">{t("yearLabel")}: </dt>
              <dd className="inline">{item.year}</dd>
            </div>
          )}
          {occasion && (
            <div>
              <dt className="inline text-text-primary/60">{t("occasionLabel")}: </dt>
              <dd className="inline">{occasion}</dd>
            </div>
          )}
        </dl>

        {description && (
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-text-muted">{description}</p>
        )}
      </RevealOnScroll>

      <RevealOnScroll className="relative mt-14 aspect-[4/5] w-full overflow-hidden md:aspect-[16/9]">
        <Image
          src={urlForImage(item.coverImage).width(1800).url()}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      </RevealOnScroll>

      {item.video?.asset && (
        <RevealOnScroll className="mt-10">
          <video
            className="w-full"
            controls
            playsInline
            preload="metadata"
          >
            <source src={item.video.asset.url} type="video/mp4" />
          </video>
        </RevealOnScroll>
      )}

      {item.gallery && item.gallery.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {item.gallery.map((image, i) => (
            <RevealOnScroll key={i} delay={i * 0.05} className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={urlForImage(image).width(1000).url()}
                alt={`${title} — ${i + 1}`}
                fill
                className="object-cover"
              />
            </RevealOnScroll>
          ))}
        </div>
      )}
    </article>
  );
}
