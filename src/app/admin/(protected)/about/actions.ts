"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeContent } from "@/lib/content/store";
import type { AboutContent } from "@/lib/content/types";

export async function updateAbout(formData: FormData): Promise<void> {
  const programsRaw = String(formData.get("programs") || "");

  const data: AboutContent = {
    portraitUrl: String(formData.get("portraitUrl") || ""),
    bio: { ka: String(formData.get("bio_ka") || ""), en: String(formData.get("bio_en") || "") },
    careerNarrative: {
      ka: String(formData.get("careerNarrative_ka") || ""),
      en: String(formData.get("careerNarrative_en") || ""),
    },
    achievementsNarrative: {
      ka: String(formData.get("achievementsNarrative_ka") || ""),
      en: String(formData.get("achievementsNarrative_en") || ""),
    },
    programs: programsRaw
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean),
  };

  await writeContent("about.json", data);
  revalidatePath("/[locale]", "layout");
  redirect("/admin/about?saved=1");
}
