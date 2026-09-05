import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { BuyButton } from "@/components/shop/BuyButton";
import { pickLocale } from "@/lib/content/locale";
import { optimizeCloudinaryUrl } from "@/lib/media";
import { getCourseBySlug } from "@/lib/courses/queries";
import { getOrders } from "@/lib/orders/queries";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [course, t] = await Promise.all([
    getCourseBySlug(slug),
    getTranslations({ locale, namespace: "courses" }),
  ]);

  if (!course) notFound();

  const title = pickLocale(course.title, locale);
  const subtitle = pickLocale(course.subtitle, locale);
  const description = pickLocale(course.description, locale);

  let seatsLeft: number | null = null;
  if (course.format === "live" && course.liveDetails) {
    // pending_payment orders never expire in this app today, so an
    // abandoned checkout keeps counting against capacity — acceptable
    // simplification here, not an exact live count.
    const orders = await getOrders();
    const taken = orders.filter(
      (o) => o.itemType === "course" && o.itemId === course.id && o.status !== "failed",
    ).length;
    seatsLeft = Math.max(0, course.liveDetails.capacity - taken);
  }

  return (
    <article className="mx-auto max-w-6xl px-6 py-24 lg:px-10 lg:py-32">
      <Link href="/courses" className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted hover:text-gold transition-colors">
        ← {t("backToShop")}
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <RevealOnScroll>
          <div className="relative aspect-video w-full overflow-hidden bg-surface">
            {course.coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={optimizeCloudinaryUrl(course.coverImageUrl)} alt={title} className="absolute inset-0 h-full w-full object-cover" />
            )}
          </div>

          {(course.format === "on_demand" || course.format === "ai_tutor") && course.sections.length > 0 && (
            <div className="mt-8 border border-hairline bg-surface p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{t("curriculumLabel")}</p>
              <div className="mt-4 flex flex-col gap-4">
                {course.sections
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <div key={section.id}>
                      <p className="text-text-primary">{pickLocale(section.title, locale)}</p>
                      <ul className="mt-1 flex flex-col gap-1">
                        {section.lessons
                          .slice()
                          .sort((a, b) => a.order - b.order)
                          .map((lesson) => (
                            <li key={lesson.id} className="text-sm text-text-muted">
                              — {pickLocale(lesson.title, locale)}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {course.format === "live" && course.liveDetails && (
            <div className="mt-8 border border-hairline bg-surface p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{t("scheduleLabel")}</p>
              <div className="mt-4 flex flex-col gap-2">
                {course.liveDetails.sessions.length > 0 ? (
                  course.liveDetails.sessions.map((s) => (
                    <p key={s.id} className="text-text-primary">
                      {s.date} · {s.startTime}–{s.endTime}
                    </p>
                  ))
                ) : (
                  <p className="text-text-muted">{t("scheduleTba")}</p>
                )}
              </div>
              <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 border-t border-hairline pt-4 font-mono text-xs uppercase tracking-widest text-text-muted">
                <div>
                  <dt className="inline text-text-primary/60">{t("locationLabel")}: </dt>
                  <dd className="inline">{pickLocale(course.liveDetails.location, locale)}</dd>
                </div>
                <div>
                  <dt className="inline text-text-primary/60">{t("seatsLeftLabel")}: </dt>
                  <dd className="inline">{seatsLeft}</dd>
                </div>
              </dl>
            </div>
          )}
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <span className="font-mono text-xs uppercase tracking-widest text-gold">{t(`format.${course.format}`)}</span>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-text-primary md:text-4xl">{title}</h1>
          {subtitle && <p className="mt-3 text-text-muted">{subtitle}</p>}
          {description && <p className="mt-4 text-text-muted leading-relaxed">{description}</p>}

          {course.instructorName && (
            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-text-muted">
              {t("instructorLabel")}: <span className="text-text-primary">{course.instructorName}</span>
            </p>
          )}

          {course.instructorBio && pickLocale(course.instructorBio, locale) && (
            <div className="mt-4 flex flex-col gap-3 border-t border-hairline pt-4">
              {pickLocale(course.instructorBio, locale)
                .split("\n\n")
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 20)} className="text-sm leading-relaxed text-text-muted">
                    {paragraph}
                  </p>
                ))}
            </div>
          )}

          <div className="mt-8 border border-hairline bg-surface p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{t("priceLabel")}</p>
            <p className="mt-2 font-display text-3xl text-gold">
              {course.price} {course.currency}
            </p>

            <div className="mt-6">
              {course.format === "live" && seatsLeft === 0 ? (
                <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{t("soldOut")}</p>
              ) : (
                <BuyButton
                  itemType="course"
                  itemId={course.id}
                  buyLabel={course.format === "live" ? t("registerCta") : t("buyCta")}
                  buyingLabel={t("buyingCta")}
                  errorLabel={t("buyError")}
                />
              )}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </article>
  );
}
