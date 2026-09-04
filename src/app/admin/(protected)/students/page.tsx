import { getCourses, getEnrollments } from "@/lib/courses/queries";
import { getPatterns, getPatternPurchases } from "@/lib/patterns/queries";
import { getUserAnalytics } from "@/lib/analytics";
import { Field, TextInput, inputClass, SaveButton } from "@/components/admin/fields";
import { UserAnalyticsTable } from "@/components/admin/UserAnalyticsTable";
import { grantAccess, sendMessage, setAccessRevoked, setPatternAccessRevoked } from "./actions";

export default async function AdminStudentsPage() {
  const [enrollments, courses, purchases, patterns, userRows] = await Promise.all([
    getEnrollments(),
    getCourses(),
    getPatternPurchases(),
    getPatterns(),
    getUserAnalytics(),
  ]);
  const courseById = new Map(courses.map((c) => [c.id, c]));
  const patternById = new Map(patterns.map((p) => [p.id, p]));

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-3xl text-text-primary">მოსწავლეები</h1>
      <p className="mt-2 text-text-muted">მოსწავლეთა პროგრესი და კურსებზე/თარგებზე წვდომის მართვა.</p>

      <div className="mt-10">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">
          მომხმარებელთა ანალიტიკა ({userRows.length})
        </p>
        <UserAnalyticsTable rows={userRows} />
      </div>

      <div className="mt-12 overflow-x-auto">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">კურსები</p>
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-hairline font-mono text-xs uppercase tracking-widest text-text-muted">
              <th className="py-3 pr-4">მოსწავლე</th>
              <th className="py-3 pr-4">კურსი</th>
              <th className="py-3 pr-4">პროგრესი</th>
              <th className="py-3 pr-4">ბოლო აქტივობა</th>
              <th className="py-3 pr-4">წვდომა</th>
              <th className="py-3 pr-4">შეტყობინება</th>
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
                  <td className="py-3 pr-4">
                    <details>
                      <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold">
                        გაგზავნა
                      </summary>
                      <form action={sendMessage} className="mt-2 flex w-56 flex-col gap-2">
                        <input type="hidden" name="studentId" value={enrollment.studentId} />
                        <TextInput name="title" placeholder="სათაური" required />
                        <textarea name="body" placeholder="ტექსტი" required className={`${inputClass} resize-none`} rows={2} />
                        <SaveButton>გაგზავნა</SaveButton>
                      </form>
                    </details>
                  </td>
                </tr>
              );
            })}
            {enrollments.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-text-muted">
                  ჯერ არცერთი მოსწავლე არ არის.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-12 overflow-x-auto">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">თარგები</p>
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-hairline font-mono text-xs uppercase tracking-widest text-text-muted">
              <th className="py-3 pr-4">მოსწავლე</th>
              <th className="py-3 pr-4">თარგი</th>
              <th className="py-3 pr-4">შეძენილია</th>
              <th className="py-3 pr-4">ჩამოტვირთვები</th>
              <th className="py-3 pr-4">წვდომა</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => {
              const pattern = patternById.get(purchase.patternId);
              return (
                <tr key={purchase.id} className="border-b border-hairline/50">
                  <td className="py-3 pr-4">
                    <p className="text-sm text-text-primary">{purchase.studentName}</p>
                    <p className="text-xs text-text-muted">{purchase.studentEmail}</p>
                  </td>
                  <td className="py-3 pr-4 text-sm text-text-muted">
                    {pattern?.title.ka || pattern?.title.en || purchase.patternId}
                  </td>
                  <td className="py-3 pr-4 text-sm text-text-muted">
                    {new Date(purchase.purchasedAt).toLocaleDateString("ka-GE")}
                  </td>
                  <td className="py-3 pr-4 text-sm text-text-muted">{purchase.downloadCount}</td>
                  <td className="py-3 pr-4">
                    <form action={setPatternAccessRevoked}>
                      <input type="hidden" name="id" value={purchase.id} />
                      <input type="hidden" name="revoked" value={(!purchase.accessRevoked).toString()} />
                      <button
                        type="submit"
                        className={
                          "font-mono text-xs uppercase tracking-widest cursor-pointer " +
                          (purchase.accessRevoked ? "text-red-400 hover:text-gold" : "text-gold hover:text-red-400")
                        }
                      >
                        {purchase.accessRevoked ? "წვდომის აღდგენა" : "წვდომის შეზღუდვა"}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {purchases.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-text-muted">
                  ჯერ არცერთი თარგი არ არის შეძენილი.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form
        action={grantAccess}
        className="mt-12 flex flex-col gap-4 border border-dashed border-hairline p-6 sm:flex-row sm:items-end sm:flex-wrap"
      >
        <p className="w-full font-mono text-xs uppercase tracking-widest text-text-muted">წვდომის ხელით გახსნა</p>
        <div className="flex-1">
          <Field label="სახელი">
            <TextInput name="name" required />
          </Field>
        </div>
        <div className="flex-1">
          <Field label="ელ-ფოსტა">
            <TextInput name="email" type="email" required />
          </Field>
        </div>
        <div className="w-40">
          <Field label="ტიპი">
            <select name="itemType" defaultValue="course" className={inputClass}>
              <option value="course">კურსი</option>
              <option value="pattern">თარგი</option>
            </select>
          </Field>
        </div>
        <div className="flex-1">
          <Field label="პროდუქტის ID">
            <TextInput name="itemId" placeholder="course-id ან pattern-id" required />
          </Field>
        </div>
        <div className="shrink-0">
          <SaveButton>წვდომის გახსნა</SaveButton>
        </div>
      </form>
    </div>
  );
}
