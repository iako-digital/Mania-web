"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeContent } from "@/lib/content/store";
import { resolveLocaleString } from "@/lib/translate";
import type { AboutContent } from "@/lib/content/types";

export async function updateAbout(formData: FormData): Promise<void> {
  const programsRaw = String(formData.get("programs") || "");

  const [bio, careerNarrative, achievementsNarrative] = await Promise.all([
    resolveLocaleString(String(formData.get("bio_ka") || ""), String(formData.get("bio_en") || "")),
    resolveLocaleString(
      String(formData.get("careerNarrative_ka") || ""),
      String(formData.get("careerNarrative_en") || ""),
    ),
    resolveLocaleString(
      String(formData.get("achievementsNarrative_ka") || ""),
      String(formData.get("achievementsNarrative_en") || ""),
    ),
  ]);

  const data: AboutContent = {
    portraitUrl: String(formData.get("portraitUrl") || ""),
    bio,
    careerNarrative,
    achievementsNarrative,
    programs: programsRaw
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean),
  };

  await writeContent("about.json", data);
  revalidatePath("/[locale]", "layout");
  redirect("/admin/about?saved=1");
}
