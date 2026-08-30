import { getCourses, getEnrollments } from "@/lib/courses/queries";
import { setAccessRevoked } from "./actions";

export default async function AdminStudentsPage() {
  const [enrollments, courses] = await Promise.all([getEnrollments(), getCourses()]);
  const courseById = new Map(courses.map((c) => [c.id, c]));

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-3xl text-text-primary">მოსწავლეები</h1>
      <p className="mt-2 text-text-muted">მოსწავლეთა პროგრესი და კურსებზე წვდომის მართვა.</p>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-hairline font-mono text-xs uppercase tracking-widest text-text-muted">
              <th className="py-3 pr-4">მოსწავლე</th>
              <th className="py-3 pr-4">კურსი</th>
              <th className="py-3 pr-4">პროგრესი</th>
              <th className="py-3 pr-4">ბოლო აქტივობა</th>
              <th className="py-3 pr-4">წვდომა</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => {
              const course = courseById.get(enrollment.courseId);
              const totalLessons = course?.sections.reduce((total, s) => total + s.lessons.length, 0) ?? 0;
              const percent = totalLessons > 0 ? Math.round((enrollment.completedLessonIds.length / totalLessons) * 100) : 0;

              return (
                <tr key={enrollment.id} className="border-b border-hairline/50">
                  <td className="py-3 pr-4">
                    <p className="text-sm text-text-primary">{enrollment.studentName}</p>
                    <p className="text-xs text-text-muted">{enrollment.studentEmail}</p>
                  </td>
                  <td className="py-3 pr-4 text-sm text-text-muted">
                    {course?.title.ka || course?.title.en || enrollment.courseId}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-hairline">
                        <div className="h-full bg-gold" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="font-mono text-xs text-text-muted">{percent}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-text-muted">
                    {new Date(enrollment.lastActivityAt).toLocaleDateString("ka-GE")}
                  </td>
                  <td className="py-3 pr-4">
                    <form action={setAccessRevoked}>
                      <input type="hidden" name="id" value={enrollment.id} />
                      <input type="hidden" name="revoked" value={(!enrollment.accessRevoked).toString()} />
                      <button
                        type="submit"
                        className={
                          "font-mono text-xs uppercase tracking-widest cursor-pointer " +
                          (enrollment.accessRevoked ? "text-red-400 hover:text-gold" : "text-gold hover:text-red-400")
                        }
                      >
                        {enrollment.accessRevoked ? "წვდომის აღდგენა" : "წვდომის შეზღუდვა"}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {enrollments.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-text-muted">
                  ჯერ არცერთი მოსწავლე არ არის.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
