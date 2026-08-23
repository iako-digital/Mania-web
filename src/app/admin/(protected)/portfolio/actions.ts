"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteItem, upsertItem } from "@/lib/content/collections";
import { resolveLocaleString } from "@/lib/translate";
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
  const slugInput = String(formData.get("slug") || "");
  const galleryRaw = String(formData.get("galleryUrls") || "");

  const [title, description, occasion] = await Promise.all([
    resolveLocaleString(String(formData.get("title_ka") || ""), String(formData.get("title_en") || "")),
    resolveLocaleString(
      String(formData.get("description_ka") || ""),
      String(formData.get("description_en") || ""),
    ),
    resolveLocaleString(String(formData.get("occasion_ka") || ""), String(formData.get("occasion_en") || "")),
  ]);

  const item: PortfolioItemContent = {
    id,
    slug: slugify(slugInput || title.en) || id.slice(0, 8),
    title,
    categorySlug: String(formData.get("categorySlug") || ""),
    description,
    coverImageUrl: String(formData.get("coverImageUrl") || ""),
    galleryUrls: galleryRaw
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean),
    videoUrl: String(formData.get("videoUrl") || ""),
    featured: formData.get("featured") === "on",
    order: Number(formData.get("order") || 0),
    year: String(formData.get("year") || ""),
    occasion,
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
