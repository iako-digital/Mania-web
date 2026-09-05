export type PaymentProvider = "BOG" | "TBC";
export type PaymentMethod = "manual_transfer" | "gateway" | "promo_code";

// pending_payment    → order created, student hasn't uploaded a receipt yet
// pending_verification → receipt uploaded, waiting on admin approval
// paid               → approved, access granted
// failed             → rejected, or a gateway payment failed
export type OrderStatus = "pending_payment" | "pending_verification" | "paid" | "failed";

export type OrderItemType = "course" | "pattern";

export interface AiReceiptVerification {
  matchConfidence: number; // 0-100
  extractedAmount: number | null;
  extractedDate: string | null;
  extractedReference: string | null;
  bankMatch: boolean;
  recommendation: "approve" | "review" | "reject";
  summary: string;
  checkedAt: string;
}

export interface Order {
  id: string;
  orderCode: string;
  provider: PaymentProvider;
  method: PaymentMethod;
  status: OrderStatus;
  itemType: OrderItemType;
  itemId: string;
  itemTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  currency: "GEL" | "USD";
  receiptUrl?: string;
  aiVerification?: AiReceiptVerification;
  promoCode?: string;
  originalAmount?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
