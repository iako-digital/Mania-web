"use server";

import { revalidatePath } from "next/cache";
import { readContent, writeContent } from "@/lib/content/store";
import type { Enrollment } from "@/lib/courses/types";

const FILE = "enrollments.json";

export async function setAccessRevoked(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const revoked = String(formData.get("revoked") || "") === "true";

  const enrollments = await readContent<Enrollment[]>(FILE);
  const enrollment = enrollments.find((e) => e.id === id);
  if (enrollment) {
    enrollment.accessRevoked = revoked;
    await writeContent(FILE, enrollments);
  }

  revalidatePath("/admin/students");
}
