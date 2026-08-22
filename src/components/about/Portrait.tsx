"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { urlForImage } from "@/lib/sanity/image";
import { scaleIn } from "@/lib/motion/variants";
import type { Image as SanityImage } from "sanity";

export function Portrait({ portrait }: { portrait?: SanityImage }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={scaleIn}
      className="crop-mark relative aspect-[4/5] w-full overflow-hidden bg-surface"
    >
      {portrait ? (
        <Image
          src={urlForImage(portrait).width(1200).height(1500).url()}
          alt="Mania Vashakidze"
          fill
          priority
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-6xl text-hairline">MV</span>
        </div>
      )}
    </motion.div>
  );
}
