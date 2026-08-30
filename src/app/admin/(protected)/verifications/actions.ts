"use server";

import { revalidatePath } from "next/cache";
import { getOrderById, saveOrder } from "@/lib/orders/queries";

export async function rejectOrder(formData: FormData): Promise<void> {
  const orderId = String(formData.get("orderId") || "");
  const order = await getOrderById(orderId);
  if (order) {
    order.status = "failed";
    order.updatedAt = new Date().toISOString();
    await saveOrder(order);
  }
  revalidatePath("/admin/verifications");
}
