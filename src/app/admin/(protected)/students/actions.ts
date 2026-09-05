"use server";

import { revalidatePath } from "next/cache";
import { readContent, writeContent } from "@/lib/content/store";
import { grantCourseAccess } from "@/lib/courses/queries";
import { grantPatternAccess } from "@/lib/patterns/queries";
import { createNotification } from "@/lib/notifications/queries";
import { setStudentPassword } from "@/lib/auth/student-credentials";
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
// src/lib/auth/current-student.ts). `target` packs itemType+itemId as
// "course:<id>" / "pattern:<id>" — the single dropdown value the admin
// picks a product from, rather than separate type+raw-id inputs.
export async function grantAccess(formData: FormData): Promise<void> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const target = String(formData.get("target") || "");
  const [itemType, itemId] = target.split(":");

  if (!name || !email || !itemType || !itemId) {
    revalidatePath("/admin/students");
    return;
  }

  if (itemType === "pattern") {
    await grantPatternAccess(itemId, email, name, email);
  } else if (itemType === "course") {
    await grantCourseAccess(itemId, email, name, email);
  }

  revalidatePath("/admin/students");
}

// Sets (or resets) a student's password for the "credentials" sign-in
// provider (see src/auth.ts) — lets them log in with email+password instead
// of Google, useful for students without a Gmail account.
export async function changeStudentPassword(formData: FormData): Promise<void> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || password.length < 6) {
    revalidatePath("/admin/students");
    return;
  }

  await setStudentPassword(email, password);
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
