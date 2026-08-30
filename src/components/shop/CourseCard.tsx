"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/lib/content/locale";
import { fadeUp } from "@/lib/motion/variants";
import type { Course } from "@/lib/courses/types";

export function CourseCard({ course }: { course: Course }) {
  const locale = useLocale();
  const t = useTranslations("courses");
  const title = pickLocale(course.title, locale);

  return (
    <motion.div variants={fadeUp}>
      <Link href={`/courses/${course.slug}`} className="crop-mark group relative block overflow-hidden border border-hairline bg-surface">
        <div className="relative aspect-video w-full overflow-hidden bg-ink">
          {course.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.coverImageUrl}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <GraduationCap size={32} className="text-text-muted/30" />
            </div>
          )}
          <span className="absolute left-3 top-3 bg-ink/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-gold">
            {t(`format.${course.format}`)}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg text-text-primary">{title}</h3>
          <p className="mt-2 text-gold">
            {course.price} {course.currency}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
