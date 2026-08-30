"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readContent } from "@/lib/content/store";
import { deleteItem, upsertItem } from "@/lib/content/collections";
import { resolveLocaleString } from "@/lib/translate";
import type { Pattern, PatternDifficulty } from "@/lib/patterns/types";

const FILE = "patterns.json";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function savePattern(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "") || randomUUID();
  const isNew = String(formData.get("id") || "") === "";
  const slugInput = String(formData.get("slug") || "");
  const galleryRaw = String(formData.get("galleryUrls") || "");

  const [title, description] = await Promise.all([
    resolveLocaleString(String(formData.get("title_ka") || ""), String(formData.get("title_en") || "")),
    resolveLocaleString(String(formData.get("description_ka") || ""), String(formData.get("description_en") || "")),
  ]);

  const existing = isNew
    ? null
    : (await readContent<Pattern[]>(FILE)).find((p) => p.id === id) ?? null;
  const now = new Date().toISOString();

  const pattern: Pattern = {
    id,
    slug: slugify(slugInput || title.en) || id.slice(0, 8),
    title,
    description,
    category: String(formData.get("category") || "").trim(),
    sizeRange: String(formData.get("sizeRange") || ""),
    difficulty: (String(formData.get("difficulty") || "intermediate") as PatternDifficulty),
    coverImageUrl: String(formData.get("coverImageUrl") || ""),
    galleryUrls: galleryRaw
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean),
    pdfUrl: String(formData.get("pdfUrl") || ""),
    price: Number(formData.get("price") || 0),
    currency: formData.get("currency") === "USD" ? "USD" : "GEL",
    published: formData.get("published") === "on",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  await upsertItem<Pattern>(FILE, pattern);
  revalidatePath("/[locale]/pattern-shop", "page");
  revalidatePath("/[locale]/pattern-shop/[slug]", "page");
  redirect(`/admin/patterns/${id}/edit?saved=1`);
}

export async function removePattern(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (id) {
    await deleteItem(FILE, id);
    revalidatePath("/admin/patterns");
    revalidatePath("/[locale]/pattern-shop", "page");
  }
  redirect("/admin/patterns?saved=1");
}
