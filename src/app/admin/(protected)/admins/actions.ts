"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/admin/auth";
import { addAdmin, removeAdmin, updateAdminRole } from "@/lib/admin/queries";
import type { AdminRole } from "@/lib/admin/types";

function parseRole(value: FormDataEntryValue | null): AdminRole {
  return value === "super_admin" ? "super_admin" : "admin";
}

export async function createAdmin(formData: FormData): Promise<void> {
  await requireSuperAdmin();

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const role = parseRole(formData.get("role"));

  if (!name || !email) {
    redirect(`/admin/admins?error=${encodeURIComponent("სახელი და ელ-ფოსტა სავალდებულოა.")}`);
  }

  try {
    await addAdmin({ name, email, role });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ადმინისტრატორის დამატება ვერ მოხერხდა.";
    redirect(`/admin/admins?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/admins");
  redirect("/admin/admins?saved=1");
}

export async function deleteAdmin(formData: FormData): Promise<void> {
  const session = await requireSuperAdmin();
  const id = String(formData.get("id") || "");
  const email = String(formData.get("email") || "");

  if (email && email === session.email) {
    redirect(`/admin/admins?error=${encodeURIComponent("საკუთარი ანგარიშის წაშლა შეუძლებელია.")}`);
  }

  try {
    await removeAdmin(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "წაშლა ვერ მოხერხდა.";
    redirect(`/admin/admins?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/admins");
  redirect("/admin/admins?saved=1");
}

export async function changeAdminRole(formData: FormData): Promise<void> {
  await requireSuperAdmin();
  const id = String(formData.get("id") || "");
  const role = parseRole(formData.get("role"));

  try {
    await updateAdminRole(id, role);
  } catch (error) {
    const message = error instanceof Error ? error.message : "როლის შეცვლა ვერ მოხერხდა.";
    redirect(`/admin/admins?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/admins");
  redirect("/admin/admins?saved=1");
}
