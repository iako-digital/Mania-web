"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { staggerChildren } from "@/lib/motion/variants";
import type { PortfolioItemWithCategory } from "@/lib/content/queries";

export function MasonryGrid({ items }: { items: PortfolioItemWithCategory[] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={staggerChildren}
      className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid"
    >
      {items.map((item, i) => (
        <ProjectCard key={item.id} item={item} priority={i < 3} />
      ))}
    </motion.div>
  );
}
