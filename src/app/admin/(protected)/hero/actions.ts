"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeContent } from "@/lib/content/store";
import { resolveLocaleString } from "@/lib/translate";
import type { HeroContent } from "@/lib/content/types";

export async function updateHero(formData: FormData): Promise<void> {
  const [headline, subheadline] = await Promise.all([
    resolveLocaleString(String(formData.get("headline_ka") || ""), String(formData.get("headline_en") || "")),
    resolveLocaleString(String(formData.get("subheadline_ka") || ""), String(formData.get("subheadline_en") || "")),
  ]);

  const data: HeroContent = {
    headline,
    subheadline,
    mediaType: formData.get("mediaType") === "video" ? "video" : "image",
    videoUrl: String(formData.get("videoUrl") || ""),
    imageUrl: String(formData.get("imageUrl") || ""),
    posterUrl: String(formData.get("posterUrl") || ""),
  };

  await writeContent("hero.json", data);
  revalidatePath("/[locale]", "layout");
  redirect("/admin/hero?saved=1");
}
