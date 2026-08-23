"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteItem, upsertItem } from "@/lib/content/collections";
import type { PortfolioItemContent } from "@/lib/content/types";

const FILE = "portfolio.json";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function savePortfolioItem(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "") || randomUUID();
  const titleEn = String(formData.get("title_en") || "");
  const slugInput = String(formData.get("slug") || "");
  const galleryRaw = String(formData.get("galleryUrls") || "");

  const item: PortfolioItemContent = {
    id,
    slug: slugify(slugInput || titleEn),
    title: { ka: String(formData.get("title_ka") || ""), en: titleEn },
    categorySlug: String(formData.get("categorySlug") || ""),
    description: {
      ka: String(formData.get("description_ka") || ""),
      en: String(formData.get("description_en") || ""),
    },
    coverImageUrl: String(formData.get("coverImageUrl") || ""),
    galleryUrls: galleryRaw
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean),
    videoUrl: String(formData.get("videoUrl") || ""),
    featured: formData.get("featured") === "on",
    order: Number(formData.get("order") || 0),
    year: String(formData.get("year") || ""),
    occasion: {
      ka: String(formData.get("occasion_ka") || ""),
      en: String(formData.get("occasion_en") || ""),
    },
  };

  await upsertItem<PortfolioItemContent>(FILE, item);
  revalidatePath("/[locale]", "layout");
  redirect("/admin/portfolio?saved=1");
}

export async function removePortfolioItem(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (id) {
    await deleteItem(FILE, id);
    revalidatePath("/[locale]", "layout");
  }
  redirect("/admin/portfolio?saved=1");
}
