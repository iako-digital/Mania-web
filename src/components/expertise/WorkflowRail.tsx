"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { pickLocale } from "@/lib/sanity/locale";
import { fadeUp, staggerChildren } from "@/lib/motion/variants";
import type { WorkflowStepData } from "@/lib/sanity/types";

export function WorkflowRail({ steps }: { steps: WorkflowStepData[] }) {
  const locale = useLocale();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={staggerChildren}
      className="relative"
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-5 md:gap-4">
        {steps.map((step, i) => (
          <motion.div key={i} variants={fadeUp} className="relative flex flex-col gap-4 md:items-start">
            <div className="flex items-center gap-4 md:flex-col md:items-start">
              <span className="font-mono text-2xl text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="h-px flex-1 bg-hairline md:hidden" />
            </div>

            <div>
              <h3 className="font-display text-lg text-text-primary md:text-xl">
                {pickLocale(step.title, locale)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {pickLocale(step.description, locale)}
              </p>
            </div>

            {i < steps.length - 1 && (
              <svg className="hidden h-2 w-full md:block" preserveAspectRatio="none">
                <motion.line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="var(--gold-dim)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
