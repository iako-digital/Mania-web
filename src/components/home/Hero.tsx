"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { urlForImage } from "@/lib/sanity/image";
import { pickLocale } from "@/lib/sanity/locale";
import { staggerChildren, fadeUp, fabricEase } from "@/lib/motion/variants";
import type { HeroSectionData } from "@/lib/sanity/types";

export function Hero({ data }: { data: HeroSectionData | null }) {
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

  const hasVideo = data?.mediaType === "video" && data.video?.asset;
  const hasImage = data?.mediaType === "image" && data.image;

  return (
    <section ref={ref} className="relative flex min-h-[92vh] items-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        {hasVideo ? (
          <video
            className="h-full w-full object-cover opacity-60"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={data?.posterImage ? urlForImage(data.posterImage).width(1600).url() : undefined}
          >
            <source src={data!.video!.asset!.url} type="video/mp4" />
          </video>
        ) : hasImage ? (
          <Image
            src={urlForImage(data!.image!).width(1920).height(1200).url()}
            alt=""
            fill
            priority
            className="object-cover opacity-60"
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
        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10"
      >
        <motion.p
          variants={fadeUp}
          className="font-mono text-xs uppercase tracking-[0.3em] text-gold"
        >
          {t("kicker")}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-6 font-display text-5xl font-medium leading-[0.95] tracking-tight text-text-primary sm:text-6xl md:text-7xl lg:text-8xl"
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
