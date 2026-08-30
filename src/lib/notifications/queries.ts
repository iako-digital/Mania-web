import { randomUUID } from "crypto";
import { readContent, writeContent } from "@/lib/content/store";
import type { Notification, NotificationType } from "./types";

const FILE = "notifications.json";

export async function getNotifications(): Promise<Notification[]> {
  return readContent<Notification[]>(FILE);
}

export async function getStudentNotifications(studentId: string): Promise<Notification[]> {
  const notifications = await getNotifications();
  return notifications
    .filter((n) => n.studentId === studentId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function createNotification(params: {
  studentId: string;
  title: string;
  body: string;
  type: NotificationType;
}): Promise<void> {
  const notifications = await getNotifications();
  notifications.push({
    id: randomUUID(),
    studentId: params.studentId,
    title: params.title,
    body: params.body,
    type: params.type,
    read: false,
    createdAt: new Date().toISOString(),
  });
  await writeContent(FILE, notifications);
}

export async function markNotificationRead(id: string, studentId: string): Promise<void> {
  const notifications = await getNotifications();
  const notification = notifications.find((n) => n.id === id && n.studentId === studentId);
  if (notification) {
    notification.read = true;
    await writeContent(FILE, notifications);
  }
}
