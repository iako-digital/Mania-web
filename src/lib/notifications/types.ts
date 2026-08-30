export type NotificationType = "order_approved" | "order_rejected" | "admin_message" | "system";

export interface Notification {
  id: string;
  studentId: string;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}
