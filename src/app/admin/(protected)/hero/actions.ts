"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeContent } from "@/lib/content/store";
import type { HeroContent } from "@/lib/content/types";

export async function updateHero(formData: FormData): Promise<void> {
  const data: HeroContent = {
    headline: {
      ka: String(formData.get("headline_ka") || ""),
      en: String(formData.get("headline_en") || ""),
    },
    subheadline: {
      ka: String(formData.get("subheadline_ka") || ""),
      en: String(formData.get("subheadline_en") || ""),
    },
    mediaType: formData.get("mediaType") === "video" ? "video" : "image",
    videoUrl: String(formData.get("videoUrl") || ""),
    imageUrl: String(formData.get("imageUrl") || ""),
    posterUrl: String(formData.get("posterUrl") || ""),
  };

  await writeContent("hero.json", data);
  revalidatePath("/[locale]", "layout");
  redirect("/admin/hero?saved=1");
}
