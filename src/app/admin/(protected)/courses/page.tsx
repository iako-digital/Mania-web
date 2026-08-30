import Link from "next/link";
import { getCourses } from "@/lib/courses/queries";
import { DeleteButton } from "@/components/admin/fields";
import { removeCourse } from "./actions";

export default async function AdminCoursesListPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const courses = await getCourses();

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary">კურსები</h1>
          <p className="mt-2 text-text-muted">კურსების მენეჯერი და Curriculum Builder.</p>
        </div>
        <Link
          href="/admin/courses/new/edit"
          className="bg-gold px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink hover:bg-text-primary transition-colors"
        >
          ახალი კურსი
        </Link>
      </div>

      {saved && <p className="mt-4 text-sm text-gold">შენახულია.</p>}

      <div className="mt-10 flex flex-col gap-3">
        {courses.length === 0 && <p className="text-text-muted">ჯერ არცერთი კურსი არ არის.</p>}

        {courses.map((course) => {
          const lessonCount = course.sections.reduce((total, s) => total + s.lessons.length, 0);
          return (
            <div key={course.id} className="flex items-center gap-4 border border-hairline bg-surface p-4">
              {course.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={course.coverImageUrl} alt="" className="h-16 w-16 shrink-0 object-cover" />
              ) : (
                <div className="h-16 w-16 shrink-0 bg-ink" />
              )}
              <div className="flex-1">
                <p className="text-text-primary">{course.title.ka || course.title.en || "(უსათაურო)"}</p>
                <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                  {course.sections.length} სექცია · {lessonCount} გაკვეთილი · {course.price} {course.currency}
                  {course.published ? " · გამოქვეყნებული" : " · დრაფტი"}
                </p>
              </div>
              <Link
                href={`/learning/${course.id}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold"
              >
                ნახვა ↗
              </Link>
              <Link
                href={`/admin/courses/${course.id}/edit`}
                className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold"
              >
                რედაქტირება
              </Link>
              <form action={removeCourse}>
                <input type="hidden" name="id" value={course.id} />
                <DeleteButton formAction={removeCourse} />
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
