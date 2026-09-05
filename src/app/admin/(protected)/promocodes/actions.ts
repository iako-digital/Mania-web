"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPromoCode, deletePromoCode, setPromoCodeActive } from "@/lib/promo-codes/queries";
import { getCourseById } from "@/lib/courses/queries";
import { getPatternById } from "@/lib/patterns/queries";
import type { OrderItemType } from "@/lib/orders/types";
import type { PromoDiscountType } from "@/lib/promo-codes/types";

function generateCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function createPromoCodeAction(formData: FormData): Promise<void> {
  const rawCode = String(formData.get("code") || "").trim();
  const target = String(formData.get("target") || "");
  const discountType: PromoDiscountType = String(formData.get("discountType") || "fixed") === "percent" ? "percent" : "fixed";
  const discountValue = Number(formData.get("discountValue") || 0);
  const usageLimitRaw = String(formData.get("usageLimit") || "").trim();
  const expiresAtRaw = String(formData.get("expiresAt") || "").trim();

  const [rawType, rawId] = target.split(":");
  const itemId = rawId || "";
  const itemType: OrderItemType | "" = rawType === "course" || rawType === "pattern" ? rawType : "";
  if (!itemType || !itemId || !discountValue || discountValue <= 0) {
    redirect(`/admin/promocodes?error=${encodeURIComponent("აირჩიეთ პროდუქტი და მიუთითეთ ფასდაკლების ოდენობა.")}`);
  }

  const item = itemType === "pattern" ? await getPatternById(itemId) : await getCourseById(itemId);
  if (!item) {
    redirect(`/admin/promocodes?error=${encodeURIComponent("პროდუქტი ვერ მოიძებნა.")}`);
  }

  try {
    await createPromoCode({
      code: rawCode || generateCode(),
      itemType,
      itemId,
      itemTitle: item.title.ka || item.title.en,
      discountType,
      discountValue,
      usageLimit: usageLimitRaw ? Number(usageLimitRaw) : null,
      expiresAt: expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "კოდის შექმნა ვერ მოხერხდა.";
    redirect(`/admin/promocodes?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/promocodes");
  redirect("/admin/promocodes?saved=1");
}

export async function togglePromoCodeAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const active = String(formData.get("active") || "") === "true";
  if (id) await setPromoCodeActive(id, active);
  revalidatePath("/admin/promocodes");
}

export async function deletePromoCodeAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (id) await deletePromoCode(id);
  revalidatePath("/admin/promocodes");
}
