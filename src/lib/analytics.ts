import { getOrders } from "@/lib/orders/queries";
import { getEnrollments } from "@/lib/courses/queries";
import { getPatternPurchases } from "@/lib/patterns/queries";

export interface UserAnalyticsRow {
  studentId: string;
  name: string;
  email: string;
  registeredAt: string;
  totalOrders: number;
  totalSpent: number;
  activeAccessCount: number;
}

// Aggregates a per-user row across orders/enrollments/pattern-purchases —
// there's no separate "user account" record in this app (identity is
// whatever email a student checks out or signs in with), so a "user" here
// is just the distinct set of studentIds seen across those three files.
export async function getUserAnalytics(): Promise<UserAnalyticsRow[]> {
  const [orders, enrollments, purchases] = await Promise.all([getOrders(), getEnrollments(), getPatternPurchases()]);

  const rows = new Map<string, UserAnalyticsRow>();

  function upsert(studentId: string, name: string, email: string, at: string) {
    const existing = rows.get(studentId);
    if (existing) {
      if (at < existing.registeredAt) existing.registeredAt = at;
      if (!existing.email && email) existing.email = email;
      if (!existing.name && name) existing.name = name;
    } else {
      rows.set(studentId, { studentId, name, email, registeredAt: at, totalOrders: 0, totalSpent: 0, activeAccessCount: 0 });
    }
  }

  for (const o of orders) {
    upsert(o.studentId, o.studentName, o.studentEmail, o.createdAt);
    const row = rows.get(o.studentId)!;
    row.totalOrders += 1;
    if (o.status === "paid") row.totalSpent += o.amount;
  }

  for (const e of enrollments) {
    upsert(e.studentId, e.studentName, e.studentEmail, e.enrolledAt);
    if (!e.accessRevoked) rows.get(e.studentId)!.activeAccessCount += 1;
  }

  for (const p of purchases) {
    upsert(p.studentId, p.studentName, p.studentEmail, p.purchasedAt);
    if (!p.accessRevoked) rows.get(p.studentId)!.activeAccessCount += 1;
  }

  return [...rows.values()].sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));
}
