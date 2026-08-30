"use server";

import { revalidatePath } from "next/cache";
import { getOrderById, saveOrder } from "@/lib/orders/queries";
import { createNotification } from "@/lib/notifications/queries";

export async function rejectOrder(formData: FormData): Promise<void> {
  const orderId = String(formData.get("orderId") || "");
  const order = await getOrderById(orderId);
  if (order) {
    order.status = "failed";
    order.updatedAt = new Date().toISOString();
    await saveOrder(order);
    await createNotification({
      studentId: order.studentId,
      title: "გადახდა უარყოფილია",
      body: `თქვენი ქვითარი „${order.itemTitle}“-ისთვის ვერ დადასტურდა. დაგვიკავშირდით დეტალებისთვის.`,
      type: "order_rejected",
    });
  }
  revalidatePath("/admin/verifications");
}
