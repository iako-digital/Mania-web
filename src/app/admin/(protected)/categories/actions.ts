"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteItem, upsertItem } from "@/lib/content/collections";
import type { CategoryItem } from "@/lib/content/types";

const FILE = "categories.json";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function saveCategory(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "") || randomUUID();
  const titleEn = String(formData.get("title_en") || "");
  const slugInput = String(formData.get("slug") || "");

  const item: CategoryItem = {
    id,
    slug: slugify(slugInput || titleEn),
    order: Number(formData.get("order") || 0),
    title: {
      ka: String(formData.get("title_ka") || ""),
      en: titleEn,
    },
  };

  await upsertItem<CategoryItem>(FILE, item);
  revalidatePath("/[locale]", "layout");
  redirect("/admin/categories?saved=1");
}

export async function removeCategory(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (id) {
    await deleteItem(FILE, id);
    revalidatePath("/[locale]", "layout");
  }
  redirect("/admin/categories?saved=1");
}
