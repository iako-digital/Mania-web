import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { getOrderById, saveOrder } from "@/lib/orders/queries";
import { grantCourseAccess } from "@/lib/courses/queries";
import { grantPatternAccess } from "@/lib/patterns/queries";
import { notifyStudentAccessGranted } from "@/lib/email";
import { createNotification } from "@/lib/notifications/queries";

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

  if (order.itemType === "course") {
    await grantCourseAccess(order.itemId, order.studentId, order.studentName, order.studentEmail);
  } else {
    await grantPatternAccess(order.itemId, order.studentId, order.studentName, order.studentEmail);
  }

  order.status = "paid";
  order.completedAt = new Date().toISOString();
  order.updatedAt = order.completedAt;
  await saveOrder(order);

  await Promise.all([
    notifyStudentAccessGranted({ to: order.studentEmail, itemTitle: order.itemTitle }),
    createNotification({
      studentId: order.studentId,
      title: "წვდომა გახსნილია",
      body: `თქვენი გადახდა დადასტურდა! ახლა შეგიძლიათ ისარგებლოთ „${order.itemTitle}“-ით.`,
      type: "order_approved",
    }),
  ]);

  return NextResponse.json({ order });
}




export const dynamic = 'force-dynamic';
