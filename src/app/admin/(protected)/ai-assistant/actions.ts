"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeContent } from "@/lib/content/store";
import { resolveLocaleString } from "@/lib/translate";
import type { AiAssistantContent } from "@/lib/content/types";

export async function updateAiAssistant(formData: FormData): Promise<void> {
  const welcomeMessage = await resolveLocaleString(
    String(formData.get("welcomeMessage_ka") || ""),
    String(formData.get("welcomeMessage_en") || ""),
  );

  const data: AiAssistantContent = {
    enabled: formData.get("enabled") === "on",
    knowledgeBase: String(formData.get("knowledgeBase") || ""),
    systemInstructions: String(formData.get("systemInstructions") || ""),
    welcomeMessage,
  };

  await writeContent("ai-assistant.json", data);
  revalidatePath("/[locale]", "layout");
  redirect("/admin/ai-assistant?saved=1");
}
