"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { pickLocale } from "@/lib/sanity/locale";
import { fadeUp, staggerChildren } from "@/lib/motion/variants";
import type { SkillData } from "@/lib/sanity/types";

export function SkillsGrid({ skills }: { skills: SkillData[] }) {
  const locale = useLocale();

  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={staggerChildren}
      className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2"
    >
      {skills.map((skill, i) => (
        <motion.li
          key={i}
          variants={fadeUp}
          className="flex items-start gap-4 border-b border-hairline pb-5"
        >
          <span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-text-primary">{pickLocale(skill.label, locale)}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
