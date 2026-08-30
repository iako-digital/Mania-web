import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getCourseById } from "@/lib/courses/queries";
import { getPatternById } from "@/lib/patterns/queries";
import { DEMO_STUDENT_EMAIL, DEMO_STUDENT_ID, DEMO_STUDENT_NAME } from "@/lib/courses/demo-student";
import { generateOrderCode, saveOrder } from "@/lib/orders/queries";
import type { Order, OrderItemType, PaymentProvider } from "@/lib/orders/types";

// Creates a "pending_payment" order for a course or pattern purchase and
// hands back its id + orderCode so /checkout/manual-transfer can show the
// student where to send the transfer and what reference code to use.
// Runs as the hard-coded demo student until real student auth exists (see
// [[demo-student]]) — swap DEMO_STUDENT_ID for the authenticated user's id.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { itemType, itemId, provider } = (body ?? {}) as Record<string, unknown>;
  if (itemType !== "course" && itemType !== "pattern") {
    return NextResponse.json({ error: "itemType must be 'course' or 'pattern'" }, { status: 400 });
  }
  if (typeof itemId !== "string" || !itemId) {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }
  const chosenProvider: PaymentProvider = provider === "TBC" ? "TBC" : "BOG";

  const item =
    (itemType as OrderItemType) === "course" ? await getCourseById(itemId) : await getPatternById(itemId);
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const order: Order = {
    id: randomUUID(),
    orderCode: generateOrderCode(),
    provider: chosenProvider,
    method: "manual_transfer",
    status: "pending_payment",
    itemType: itemType as OrderItemType,
    itemId,
    itemTitle: item.title.ka || item.title.en,
    studentId: DEMO_STUDENT_ID,
    studentName: DEMO_STUDENT_NAME,
    studentEmail: DEMO_STUDENT_EMAIL,
    amount: item.price,
    currency: item.currency,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveOrder(order);

  return NextResponse.json({ order }, { status: 201 });
}
