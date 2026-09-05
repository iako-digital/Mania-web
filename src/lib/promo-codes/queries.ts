import { randomUUID } from "crypto";
import { readContent, writeContent } from "@/lib/content/store";
import type { OrderItemType } from "@/lib/orders/types";
import type { PromoCode, PromoDiscountType } from "./types";

const FILE = "promo-codes.json";

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

export async function getPromoCodes(): Promise<PromoCode[]> {
  try {
    const codes = await readContent<PromoCode[]>(FILE);
    return [...codes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export async function getPromoCodeByCode(code: string): Promise<PromoCode | null> {
  const codes = await getPromoCodes();
  const normalized = normalizeCode(code);
  return codes.find((c) => c.code === normalized) ?? null;
}

export async function createPromoCode(input: {
  code: string;
  itemType: OrderItemType;
  itemId: string;
  itemTitle: string;
  discountType: PromoDiscountType;
  discountValue: number;
  usageLimit: number | null;
  expiresAt: string | null;
}): Promise<PromoCode> {
  const codes = await getPromoCodes();
  const normalized = normalizeCode(input.code);
  if (codes.some((c) => c.code === normalized)) {
    throw new Error("ეს კოდი უკვე არსებობს.");
  }

  const promo: PromoCode = {
    id: randomUUID(),
    code: normalized,
    itemType: input.itemType,
    itemId: input.itemId,
    itemTitle: input.itemTitle,
    discountType: input.discountType,
    discountValue: input.discountValue,
    active: true,
    usageLimit: input.usageLimit,
    usedCount: 0,
    createdAt: new Date().toISOString(),
    expiresAt: input.expiresAt,
  };

  await writeContent(FILE, [promo, ...codes]);
  return promo;
}

export async function setPromoCodeActive(id: string, active: boolean): Promise<void> {
  const codes = await getPromoCodes();
  const updated = codes.map((c) => (c.id === id ? { ...c, active } : c));
  await writeContent(FILE, updated);
}

export async function deletePromoCode(id: string): Promise<void> {
  const codes = await getPromoCodes();
  await writeContent(
    FILE,
    codes.filter((c) => c.id !== id),
  );
}

export function computeDiscountedAmount(promo: PromoCode, originalAmount: number): number {
  const raw =
    promo.discountType === "percent"
      ? originalAmount * (1 - promo.discountValue / 100)
      : originalAmount - promo.discountValue;
  return Math.round(Math.max(0, raw) * 100) / 100;
}

export type PromoValidationResult =
  | { ok: true; promo: PromoCode; discountedAmount: number }
  | { ok: false; error: string };

export async function validatePromoCode(
  rawCode: string,
  itemType: OrderItemType,
  itemId: string,
  originalAmount: number,
): Promise<PromoValidationResult> {
  const promo = await getPromoCodeByCode(rawCode);
  if (!promo) return { ok: false, error: "პრომო კოდი ვერ მოიძებნა." };
  if (!promo.active) return { ok: false, error: "ეს კოდი აღარ არის აქტიური." };
  if (promo.expiresAt && new Date(promo.expiresAt).getTime() < Date.now()) {
    return { ok: false, error: "კოდის ვადა ამოწურულია." };
  }
  if (promo.usageLimit != null && promo.usedCount >= promo.usageLimit) {
    return { ok: false, error: "კოდის გამოყენების ლიმიტი ამოწურულია." };
  }
  if (promo.itemType !== itemType || promo.itemId !== itemId) {
    return { ok: false, error: "ეს კოდი არ შეესაბამება ამ პროდუქტს." };
  }

  const discountedAmount = computeDiscountedAmount(promo, originalAmount);
  return { ok: true, promo, discountedAmount };
}

// Counts a redemption the moment a code is successfully applied to an order
// — whether or not that order later completes. This app already treats
// abandoned pending_payment orders as a non-issue (see the seatsLeft comment
// in courses/[slug]/page.tsx), so redeem-at-apply keeps the usage count in
// one place instead of needing a hook into the payment-approval flow too.
export async function recordPromoCodeUsage(id: string): Promise<void> {
  const codes = await getPromoCodes();
  const updated = codes.map((c) => (c.id === id ? { ...c, usedCount: c.usedCount + 1 } : c));
  await writeContent(FILE, updated);
}
