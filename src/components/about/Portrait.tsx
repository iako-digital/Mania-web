"use client";

import { motion } from "framer-motion";
import { scaleIn } from "@/lib/motion/variants";

export function Portrait({ portraitUrl }: { portraitUrl?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={scaleIn}
      className="crop-mark relative aspect-[4/5] w-full overflow-hidden bg-surface"
    >
      {portraitUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={portraitUrl}
          alt="Mania Vashakidze"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-6xl text-hairline">MV</span>
        </div>
      )}
    </motion.div>
  );
}
