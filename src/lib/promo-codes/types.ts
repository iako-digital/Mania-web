import type { OrderItemType } from "@/lib/orders/types";

export type PromoDiscountType = "fixed" | "percent";

export interface PromoCode {
  id: string;
  code: string;
  itemType: OrderItemType;
  itemId: string;
  itemTitle: string;
  discountType: PromoDiscountType;
  discountValue: number;
  active: boolean;
  usageLimit: number | null;
  usedCount: number;
  createdAt: string;
  expiresAt: string | null;
}
