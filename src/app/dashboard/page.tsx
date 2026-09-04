import { getCourses, getStudentEnrollments } from "@/lib/courses/queries";
import { getPatterns, getStudentPatternPurchases } from "@/lib/patterns/queries";
import { getStudentOrders } from "@/lib/orders/queries";
import { getStudentNotifications } from "@/lib/notifications/queries";
import { getCurrentStudent } from "@/lib/auth/current-student";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import type { Order } from "@/lib/orders/types";

function findPendingOrder(orders: Order[], itemType: "course" | "pattern", itemId: string) {
  return orders.find(
    (o) => o.itemType === itemType && o.itemId === itemId && (o.status === "pending_payment" || o.status === "pending_verification"),
  );
}

export default async function DashboardPage() {
  const student = await getCurrentStudent();
  const [enrollments, courses, purchases, patterns, orders, notifications] = await Promise.all([
    getStudentEnrollments(student.id),
    getCourses(),
    getStudentPatternPurchases(student.id),
    getPatterns(),
    getStudentOrders(student.id),
    getStudentNotifications(student.id),
  ]);

  const enrollmentByCourseId = new Map(enrollments.map((e) => [e.courseId, e]));
  const purchaseByPatternId = new Map(purchases.map((p) => [p.patternId, p]));

  // Every published product shows up here — not just owned ones — with a
  // per-item status (available/pending/active) so the dashboard doubles as
  // a full catalog view, not just a purchase history.
  const myCourses = courses
    .filter((c) => c.published)
    .map((course) => {
      const enrollment = enrollmentByCourseId.get(course.id);
      const title = course.title.ka || course.title.en;

      if (enrollment && !enrollment.accessRevoked) {
        const totalLessons = course.sections.reduce((total, s) => total + s.lessons.length, 0);
        const percent = totalLessons > 0 ? Math.round((enrollment.completedLessonIds.length / totalLessons) * 100) : 0;
        return { courseId: course.id, slug: course.slug, title, price: course.price, currency: course.currency, status: "active" as const, percent };
      }

      const pendingOrder = findPendingOrder(orders, "course", course.id);
      if (pendingOrder) {
        return {
          courseId: course.id,
          slug: course.slug,
          title,
          price: course.price,
          currency: course.currency,
          status: "pending" as const,
          orderStatus: pendingOrder.status as "pending_payment" | "pending_verification",
        };
      }

      return { courseId: course.id, slug: course.slug, title, price: course.price, currency: course.currency, status: "available" as const };
    });

  const myPatterns = patterns
    .filter((p) => p.published)
    .map((pattern) => {
      const purchase = purchaseByPatternId.get(pattern.id);
      const title = pattern.title.ka || pattern.title.en;

      if (purchase && !purchase.accessRevoked) {
        return {
          patternId: pattern.id,
          slug: pattern.slug,
          title,
          price: pattern.price,
          currency: pattern.currency,
          status: "active" as const,
          purchasedAt: purchase.purchasedAt,
        };
      }

      const pendingOrder = findPendingOrder(orders, "pattern", pattern.id);
      if (pendingOrder) {
        return {
          patternId: pattern.id,
          slug: pattern.slug,
          title,
          price: pattern.price,
          currency: pattern.currency,
          status: "pending" as const,
          orderStatus: pendingOrder.status as "pending_payment" | "pending_verification",
        };
      }

      return { patternId: pattern.id, slug: pattern.slug, title, price: pattern.price, currency: pattern.currency, status: "available" as const };
    });

  return (
    <div>
      <DashboardNav active="/dashboard" />

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="border border-hairline bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">პროფილი</p>
          <p className="mt-2 text-lg text-text-primary">{student.name}</p>
          <p className="text-sm text-text-muted">{student.email}</p>
        </div>

        <div className="mt-8">
          <DashboardTabs
            myCourses={myCourses}
            myPatterns={myPatterns}
            myOrders={orders.map((o) => ({
              orderCode: o.orderCode,
              itemTitle: o.itemTitle,
              amount: o.amount,
              currency: o.currency,
              status: o.status,
            }))}
            myNotifications={notifications}
          />
        </div>
      </div>
    </div>
  );
}
