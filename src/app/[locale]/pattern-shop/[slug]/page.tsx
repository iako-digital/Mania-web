import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { BuyButton } from "@/components/shop/BuyButton";
import { pickLocale } from "@/lib/content/locale";
import { optimizeCloudinaryUrl } from "@/lib/media";
import { getPatternBySlug } from "@/lib/patterns/queries";

export default async function PatternDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [pattern, t] = await Promise.all([
    getPatternBySlug(slug),
    getTranslations({ locale, namespace: "patternShop" }),
  ]);

  if (!pattern) notFound();

  const title = pickLocale(pattern.title, locale);
  const description = pickLocale(pattern.description, locale);
  const difficultyLabel = t(`difficulty.${pattern.difficulty}`);
  const gallery = [pattern.coverImageUrl, ...pattern.galleryUrls].filter(Boolean);

  return (
    <article className="mx-auto max-w-6xl px-6 py-24 lg:px-10 lg:py-32">
      <Link href="/pattern-shop" className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted hover:text-gold transition-colors">
        ← {t("backToShop")}
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <RevealOnScroll>
          <div className="grid grid-cols-1 gap-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
              {gallery[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={optimizeCloudinaryUrl(gallery[0])} alt={title} className="absolute inset-0 h-full w-full object-cover" />
              )}
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {gallery.slice(1).map((url) => (
                  <div key={url} className="relative aspect-square overflow-hidden bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={optimizeCloudinaryUrl(url)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <h1 className="font-display text-3xl font-medium tracking-tight text-text-primary md:text-4xl">{title}</h1>
          {description && <p className="mt-4 text-text-muted leading-relaxed">{description}</p>}

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-y border-hairline py-6 font-mono text-xs uppercase tracking-widest text-text-muted">
            <div>
              <dt className="inline text-text-primary/60">{t("sizeRangeLabel")}: </dt>
              <dd className="inline">{pattern.sizeRange}</dd>
            </div>
            <div>
              <dt className="inline text-text-primary/60">{t("difficultyLabel")}: </dt>
              <dd className="inline">{difficultyLabel}</dd>
            </div>
          </dl>

          <div className="mt-8 border border-hairline bg-surface p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{t("priceLabel")}</p>
            <p className="mt-2 font-display text-3xl text-gold">
              {pattern.price} {pattern.currency}
            </p>
            <p className="mt-1 text-xs text-text-muted">{t("instantDownload")}</p>

            <div className="mt-6">
              <BuyButton
                itemType="pattern"
                itemId={pattern.id}
                buyLabel={t("buyCta")}
                buyingLabel={t("buyingCta")}
                errorLabel={t("buyError")}
                promoPlaceholder={t("promoCodePlaceholder")}
                accessGrantedMessage={t("accessGrantedMessage")}
                goToDashboardLabel={t("goToDashboard")}
              />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </article>
  );
}
