"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteItem, upsertItem } from "@/lib/content/collections";
import type { WorkflowStepItem } from "@/lib/content/types";

const FILE = "workflow.json";

export async function saveWorkflowStep(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "") || randomUUID();

  const item: WorkflowStepItem = {
    id,
    order: Number(formData.get("order") || 0),
    title: {
      ka: String(formData.get("title_ka") || ""),
      en: String(formData.get("title_en") || ""),
    },
    description: {
      ka: String(formData.get("description_ka") || ""),
      en: String(formData.get("description_en") || ""),
    },
  };

  await upsertItem<WorkflowStepItem>(FILE, item);
  revalidatePath("/[locale]", "layout");
  redirect("/admin/workflow?saved=1");
}

export async function removeWorkflowStep(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (id) {
    await deleteItem(FILE, id);
    revalidatePath("/[locale]", "layout");
  }
  redirect("/admin/workflow?saved=1");
}
