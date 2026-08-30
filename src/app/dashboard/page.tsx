import { getCourses, getStudentEnrollments } from "@/lib/courses/queries";
import { getPatterns, getStudentPatternPurchases } from "@/lib/patterns/queries";
import { getStudentOrders } from "@/lib/orders/queries";
import { getStudentNotifications } from "@/lib/notifications/queries";
import { getCurrentStudent } from "@/lib/auth/current-student";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

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

  const courseById = new Map(courses.map((c) => [c.id, c]));
  const patternById = new Map(patterns.map((p) => [p.id, p]));

  const myCourses = enrollments
    .filter((e) => !e.accessRevoked && courseById.has(e.courseId))
    .map((e) => {
      const course = courseById.get(e.courseId)!;
      const totalLessons = course.sections.reduce((total, s) => total + s.lessons.length, 0);
      const percent = totalLessons > 0 ? Math.round((e.completedLessonIds.length / totalLessons) * 100) : 0;
      return { courseId: course.id, title: course.title.ka || course.title.en, percent };
    });

  const myPatterns = purchases
    .filter((p) => !p.accessRevoked && patternById.has(p.patternId))
    .map((p) => {
      const pattern = patternById.get(p.patternId)!;
      return { patternId: pattern.id, title: pattern.title.ka || pattern.title.en, purchasedAt: p.purchasedAt };
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
