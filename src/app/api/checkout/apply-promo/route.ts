import { NextResponse } from "next/server";
import { getCurrentStudent } from "@/lib/auth/current-student";
import { getOrderById, saveOrder } from "@/lib/orders/queries";
import { validatePromoCode, recordPromoCodeUsage } from "@/lib/promo-codes/queries";
import { grantOrderAccess } from "@/lib/orders/fulfillment";

// Applies a promo code to an order already sitting on /checkout/manual-transfer
// (created at full price before the student typed a code). Recalculates the
// order's amount and, if it drops to 0 GEL, marks it paid and grants access
// right away — no receipt upload needed.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { orderId, code } = (body ?? {}) as Record<string, unknown>;
  if (typeof orderId !== "string" || !orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }
  if (typeof code !== "string" || !code.trim()) {
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  }

  const order = await getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const student = await getCurrentStudent();
  if (order.studentId !== student.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (order.status !== "pending_payment") {
    return NextResponse.json({ error: "ეს შეკვეთა უკვე დამუშავებულია." }, { status: 400 });
  }

  const baseAmount = order.originalAmount ?? order.amount;
  const result = await validatePromoCode(code, order.itemType, order.itemId, baseAmount);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  order.promoCode = result.promo.code;
  order.originalAmount = baseAmount;
  order.amount = result.discountedAmount;
  order.updatedAt = new Date().toISOString();

  const granted = result.discountedAmount === 0;
  if (granted) {
    order.status = "paid";
    order.method = "promo_code";
    order.completedAt = order.updatedAt;
  }

  await saveOrder(order);
  await recordPromoCodeUsage(result.promo.id);

  if (granted) {
    await grantOrderAccess(order);
  }

  return NextResponse.json({ order, granted });
}
