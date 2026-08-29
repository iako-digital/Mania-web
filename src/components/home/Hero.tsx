"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { YouTubeBackground } from "@/components/ui/YouTubeBackground";
import { pickLocale } from "@/lib/content/locale";
import { getYouTubeId } from "@/lib/youtube";
import { staggerChildren, fadeUp, fabricEase } from "@/lib/motion/variants";
import type { HeroContent } from "@/lib/content/types";

export function Hero({ data }: { data: HeroContent | null }) {
  const t = useTranslations("home");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const gridOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0]);

  const headline = pickLocale(data?.headline, locale) || "MANIA VASHAKIDZE";
  const subheadline =
    pickLocale(data?.subheadline, locale) ||
    (locale === "en"
      ? "Where a technical blueprint resolves into a finished garment."
      : "სადაც ტექნიკური ნახაზი მზა სამოსად იქცევა.");

  // A video banner takes priority whenever one is set, falling back to the
  // photo, then to the ambient gradient — no separate "media type" toggle
  // to keep in sync with which field is actually filled in.
  const hasVideo = Boolean(data?.videoUrl);
  const hasImage = !hasVideo && Boolean(data?.imageUrl);
  const youTubeId = hasVideo ? getYouTubeId(data!.videoUrl) : null;

  return (
    <section ref={ref} className="relative flex min-h-[92vh] items-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        {hasVideo && youTubeId ? (
          <div className="absolute inset-0 opacity-60">
            <YouTubeBackground videoId={youTubeId} />
          </div>
        ) : hasVideo ? (
          <video
            className="h-full w-full bg-ink object-contain opacity-60 sm:object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={data?.posterUrl || undefined}
          >
            <source src={data!.videoUrl} type="video/mp4" />
          </video>
        ) : hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data!.imageUrl}
            alt=""
            className="h-full w-full bg-ink object-contain opacity-60 sm:object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-surface via-ink to-ink" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
        <motion.div
          style={{ opacity: gridOpacity }}
          className="absolute inset-0"
          aria-hidden="true"
        >
          <svg className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <pattern id="hero-grid" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M 64 0 L 0 0 0 64" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.25" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="relative z-10 mx-auto max-w-7xl px-6 pb-24 sm:pb-0 lg:px-10"
      >
        <motion.p
          variants={fadeUp}
          className="font-mono text-xs uppercase tracking-[0.3em] text-gold"
        >
          {t("kicker")}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-6 font-display text-3xl font-medium leading-[0.95] tracking-tight text-text-primary sm:text-5xl md:text-7xl lg:text-8xl"
          style={{ clipPath: "inset(0 0 0 0)" }}
        >
          {headline.split(" ").map((word, i) => (
            <motion.span
              key={i}
              variants={fadeUp}
              transition={{ ease: fabricEase }}
              className="mr-4 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-lg text-base leading-relaxed text-text-muted md:text-lg"
        >
          {subheadline}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
          <Button href="/portfolio" variant="primary">
            {t("heroCta")}
          </Button>
          <Button href="/expertise" variant="ghost">
            {t("heroSecondaryCta")}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
