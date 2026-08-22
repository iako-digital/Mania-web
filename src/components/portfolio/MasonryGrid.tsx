"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { staggerChildren } from "@/lib/motion/variants";
import type { PortfolioItemSummary } from "@/lib/sanity/types";

export function MasonryGrid({ items }: { items: PortfolioItemSummary[] }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={staggerChildren}
      className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid"
    >
      {items.map((item, i) => (
        <ProjectCard key={item._id} item={item} priority={i < 3} />
      ))}
    </motion.div>
  );
}
