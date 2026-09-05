import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { getOrderById, saveOrder } from "@/lib/orders/queries";
import { grantOrderAccess } from "@/lib/orders/fulfillment";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { orderId } = (body ?? {}) as Record<string, unknown>;
  if (typeof orderId !== "string" || !orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const order = await getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  order.status = "paid";
  order.completedAt = new Date().toISOString();
  order.updatedAt = order.completedAt;
  await saveOrder(order);

  await grantOrderAccess(order);

  return NextResponse.json({ order });
}
