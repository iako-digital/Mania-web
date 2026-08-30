"use server";

import { revalidatePath } from "next/cache";
import { readContent, writeContent } from "@/lib/content/store";
import { grantCourseAccess } from "@/lib/courses/queries";
import { grantPatternAccess } from "@/lib/patterns/queries";
import { createNotification } from "@/lib/notifications/queries";
import type { Enrollment } from "@/lib/courses/types";
import type { PatternPurchase } from "@/lib/patterns/types";

const ENROLLMENTS_FILE = "enrollments.json";
const PURCHASES_FILE = "pattern-purchases.json";

export async function setAccessRevoked(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const revoked = String(formData.get("revoked") || "") === "true";

  const enrollments = await readContent<Enrollment[]>(ENROLLMENTS_FILE);
  const enrollment = enrollments.find((e) => e.id === id);
  if (enrollment) {
    enrollment.accessRevoked = revoked;
    await writeContent(ENROLLMENTS_FILE, enrollments);
  }

  revalidatePath("/admin/students");
}

export async function setPatternAccessRevoked(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const revoked = String(formData.get("revoked") || "") === "true";

  const purchases = await readContent<PatternPurchase[]>(PURCHASES_FILE);
  const purchase = purchases.find((p) => p.id === id);
  if (purchase) {
    purchase.accessRevoked = revoked;
    await writeContent(PURCHASES_FILE, purchases);
  }

  revalidatePath("/admin/students");
}

// Manually grants a course or pattern to a student without going through an
// order — for edge cases (comped access, a payment handled outside the
// site, etc). The student is identified by email, matching the id
// convention used everywhere else once Google sign-in is configured (see
// src/lib/auth/current-student.ts).
export async function grantAccess(formData: FormData): Promise<void> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const itemType = String(formData.get("itemType") || "");
  const itemId = String(formData.get("itemId") || "");

  if (!name || !email || !itemId) {
    revalidatePath("/admin/students");
    return;
  }

  if (itemType === "pattern") {
    await grantPatternAccess(itemId, email, name, email);
  } else {
    await grantCourseAccess(itemId, email, name, email);
  }

  revalidatePath("/admin/students");
}

export async function sendMessage(formData: FormData): Promise<void> {
  const studentId = String(formData.get("studentId") || "");
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!studentId || !title || !body) {
    revalidatePath("/admin/students");
    return;
  }

  await createNotification({ studentId, title, body, type: "admin_message" });
  revalidatePath("/admin/students");
}
