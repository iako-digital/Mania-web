import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { pickLocale } from "@/lib/content/locale";
import { isVideoUrl } from "@/lib/media";
import { getPortfolioItemBySlug } from "@/lib/content/queries";
import { getYouTubeId } from "@/lib/youtube";

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
  const youTubeId = getYouTubeId(item.videoUrl);

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.coverImageUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
      </RevealOnScroll>

      {item.videoUrl && youTubeId && (
        <RevealOnScroll className="mt-10">
          <YouTubeEmbed videoId={youTubeId} title={title} />
        </RevealOnScroll>
      )}

      {item.videoUrl && !youTubeId && (
        <RevealOnScroll className="mt-10 text-center">
          {/* No fixed box: width/height stay at the video's own ratio, only
              capped so a portrait clip never dwarfs the page and a landscape
              one never overflows the column. */}
          <video className="mx-auto block max-h-[80vh] max-w-full bg-surface" controls playsInline preload="metadata">
            <source src={item.videoUrl} type="video/mp4" />
          </video>
        </RevealOnScroll>
      )}

      {item.galleryUrls && item.galleryUrls.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {item.galleryUrls.map((url, i) => (
            <RevealOnScroll key={url} delay={i * 0.05} className="relative aspect-[4/5] overflow-hidden">
              {isVideoUrl(url) ? (
                <video
                  src={url}
                  className="absolute inset-0 h-full w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={`${title} — ${i + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </RevealOnScroll>
          ))}
        </div>
      )}
    </article>
  );
}
