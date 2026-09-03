import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getCourseById } from "@/lib/courses/queries";
import { getPatternById } from "@/lib/patterns/queries";
import { getCurrentStudent } from "@/lib/auth/current-student";
import { generateOrderCode, saveOrder } from "@/lib/orders/queries";
import { getBankAccounts } from "@/lib/payments/bank-accounts";
import { notifyStudentOrderCreated } from "@/lib/email";
import type { Order, OrderItemType, PaymentProvider } from "@/lib/orders/types";

// Creates a "pending_payment" order for a course or pattern purchase and
// hands back its id + orderCode so /checkout/manual-transfer can show the
// student where to send the transfer and what reference code to use.
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

  const student = await getCurrentStudent();

  const order: Order = {
    id: randomUUID(),
    orderCode: generateOrderCode(),
    provider: chosenProvider,
    method: "manual_transfer",
    status: "pending_payment",
    itemType: itemType as OrderItemType,
    itemId,
    itemTitle: item.title.ka || item.title.en,
    studentId: student.id,
    studentName: student.name,
    studentEmail: student.email,
    amount: item.price,
    currency: item.currency,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveOrder(order);

  const account = getBankAccounts().find((a) => a.provider === chosenProvider);
  await notifyStudentOrderCreated({
    to: order.studentEmail,
    orderCode: order.orderCode,
    itemTitle: order.itemTitle,
    amount: order.amount,
    currency: order.currency,
    bankName: account?.bankName ?? "",
    accountHolder: account?.accountHolder ?? "",
    iban: account?.iban ?? "",
  });

  return NextResponse.json({ order }, { status: 201 });
}
