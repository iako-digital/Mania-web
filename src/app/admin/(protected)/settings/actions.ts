"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeContent } from "@/lib/content/store";
import type { SiteSettings } from "@/lib/content/types";

export async function updateSettings(formData: FormData): Promise<void> {
  const socialRaw = String(formData.get("socialLinks") || "");

  const data: SiteSettings = {
    siteName: String(formData.get("siteName") || ""),
    tagline: {
      ka: String(formData.get("tagline_ka") || ""),
      en: String(formData.get("tagline_en") || ""),
    },
    phone: String(formData.get("phone") || ""),
    email: String(formData.get("email") || ""),
    location: String(formData.get("location") || ""),
    socialLinks: socialRaw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, url] = line.split("|").map((part) => part.trim());
        return { label: label || url, url: url || label };
      }),
  };

  await writeContent("site.json", data);
  revalidatePath("/[locale]", "layout");
  redirect("/admin/settings?saved=1");
}
