import { grantCourseAccess } from "@/lib/courses/queries";
import { grantPatternAccess } from "@/lib/patterns/queries";
import { notifyStudentAccessGranted } from "@/lib/email";
import { createNotification } from "@/lib/notifications/queries";
import type { Order } from "./types";

// Shared by the admin's "Approve" action on a manual-transfer receipt and
// by the promo-code checkout paths (a 0-GEL code grants access instantly,
// with no receipt to approve) — both need the exact same course/pattern
// grant + notification steps once an order is considered paid.
export async function grantOrderAccess(order: Order): Promise<void> {
  if (order.itemType === "course") {
    await grantCourseAccess(order.itemId, order.studentId, order.studentName, order.studentEmail);
  } else {
    await grantPatternAccess(order.itemId, order.studentId, order.studentName, order.studentEmail);
  }

  await Promise.all([
    notifyStudentAccessGranted({ to: order.studentEmail, itemTitle: order.itemTitle }),
    createNotification({
      studentId: order.studentId,
      title: "წვდომა გახსნილია",
      body: `თქვენი გადახდა დადასტურდა! ახლა შეგიძლიათ ისარგებლოთ „${order.itemTitle}“-ით.`,
      type: "order_approved",
    }),
  ]);
}
