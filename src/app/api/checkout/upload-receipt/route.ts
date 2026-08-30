import { NextResponse } from "next/server";
import { DEMO_STUDENT_ID } from "@/lib/courses/demo-student";
import { getOrderById, saveOrder } from "@/lib/orders/queries";
import { notifyAdminNewReceipt, notifyStudentVerificationPending } from "@/lib/email";

// The file itself is uploaded straight from the browser to Cloudinary (same
// unsigned upload used everywhere else in the app — see cloudinary-upload.ts)
// — this route just records the resulting URL against the order and moves
// it into review.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { orderId, receiptUrl } = (body ?? {}) as Record<string, unknown>;
  if (typeof orderId !== "string" || typeof receiptUrl !== "string" || !receiptUrl) {
    return NextResponse.json({ error: "orderId and receiptUrl are required" }, { status: 400 });
  }

  const order = await getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.studentId !== DEMO_STUDENT_ID) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  order.receiptUrl = receiptUrl;
  order.status = "pending_verification";
  order.updatedAt = new Date().toISOString();
  await saveOrder(order);

  await Promise.all([
    notifyAdminNewReceipt({
      orderCode: order.orderCode,
      itemTitle: order.itemTitle,
      studentName: order.studentName,
      amount: order.amount,
      currency: order.currency,
    }),
    notifyStudentVerificationPending({
      to: order.studentEmail,
      orderCode: order.orderCode,
      itemTitle: order.itemTitle,
    }),
  ]);

  return NextResponse.json({ order });
}
