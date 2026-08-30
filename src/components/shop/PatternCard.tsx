"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/lib/content/locale";
import { fadeUp } from "@/lib/motion/variants";
import type { Pattern } from "@/lib/patterns/types";

export function PatternCard({ pattern }: { pattern: Pattern }) {
  const locale = useLocale();
  const title = pickLocale(pattern.title, locale);

  return (
    <motion.div variants={fadeUp}>
      <Link href={`/pattern-shop/${pattern.slug}`} className="crop-mark group relative block overflow-hidden border border-hairline bg-surface">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
          {pattern.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pattern.coverImageUrl}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0" />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg text-text-primary">{title}</h3>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-text-muted">{pattern.sizeRange}</p>
          <p className="mt-2 text-gold">
            {pattern.price} {pattern.currency}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
