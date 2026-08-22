"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { urlForImage } from "@/lib/sanity/image";
import { pickLocale } from "@/lib/sanity/locale";
import { fadeUp } from "@/lib/motion/variants";
import type { PortfolioItemSummary } from "@/lib/sanity/types";

export function ProjectCard({
  item,
  className = "",
  priority = false,
}: {
  item: PortfolioItemSummary;
  className?: string;
  priority?: boolean;
}) {
  const locale = useLocale();
  const title = pickLocale(item.title, locale);
  const category = item.category ? pickLocale(item.category.title, locale) : "";

  return (
    <motion.div variants={fadeUp} className={className}>
      <Link href={`/portfolio/${item.slug}`} className="crop-mark group relative block overflow-hidden">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
          <Image
            src={urlForImage(item.coverImage).width(900).height(1125).url()}
            alt={title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(201,169,97,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,169,97,0.35) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            {category && (
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                {category}
              </span>
            )}
            <h3 className="mt-1 font-display text-xl text-text-primary md:text-2xl">{title}</h3>
            {item.year && (
              <span className="mt-1 block font-mono text-xs text-text-muted">{item.year}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
