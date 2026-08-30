import { randomBytes } from "crypto";
import { readContent, writeContent } from "@/lib/content/store";
import type { Order } from "./types";

const FILE = "orders.json";

export function generateOrderCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function getOrders(): Promise<Order[]> {
  const orders = await readContent<Order[]>(FILE);
  return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await readContent<Order[]>(FILE);
  return orders.find((o) => o.id === id) ?? null;
}

export async function getStudentOrders(studentId: string): Promise<Order[]> {
  const orders = await getOrders();
  return orders.filter((o) => o.studentId === studentId);
}

export async function getPendingVerificationOrders(): Promise<Order[]> {
  const orders = await getOrders();
  return orders.filter((o) => o.status === "pending_verification");
}

export async function saveOrder(order: Order): Promise<void> {
  const orders = await readContent<Order[]>(FILE);
  const index = orders.findIndex((o) => o.id === order.id);
  if (index >= 0) {
    orders[index] = order;
  } else {
    orders.push(order);
  }
  await writeContent(FILE, orders);
}

export function sumRevenue(orders: Order[]): number {
  return orders.filter((o) => o.status === "paid").reduce((total, o) => total + o.amount, 0);
}
