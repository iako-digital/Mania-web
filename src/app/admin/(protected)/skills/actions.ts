"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteItem, upsertItem } from "@/lib/content/collections";
import { resolveLocaleString } from "@/lib/translate";
import type { SkillItem } from "@/lib/content/types";

const FILE = "skills.json";

export async function saveSkill(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "") || randomUUID();

  const label = await resolveLocaleString(
    String(formData.get("label_ka") || ""),
    String(formData.get("label_en") || ""),
  );

  const item: SkillItem = {
    id,
    order: Number(formData.get("order") || 0),
    label,
  };

  await upsertItem<SkillItem>(FILE, item);
  revalidatePath("/[locale]", "layout");
  redirect("/admin/skills?saved=1");
}

export async function removeSkill(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (id) {
    await deleteItem(FILE, id);
    revalidatePath("/[locale]", "layout");
  }
  redirect("/admin/skills?saved=1");
}
