import { notFound } from "next/navigation";
import { getCourseById } from "@/lib/courses/queries";
import { BilingualInput, BilingualTextarea, DeleteButton, Field, SaveButton, TextInput } from "@/components/admin/fields";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { PdfUploadField } from "@/components/admin/PdfUploadField";
import { BunnyVideoField } from "@/components/admin/BunnyVideoField";
import { CourseFormatFields } from "@/components/admin/CourseFormatFields";
import { UploadGateProvider } from "@/components/admin/UploadGateContext";
import type { Course } from "@/lib/courses/types";
import {
  addLesson,
  addSection,
  removeLesson,
  removeSection,
  saveCourseMeta,
  saveLessonMedia,
} from "../../actions";

const EMPTY: Course = {
  id: "",
  slug: "",
  title: { ka: "", en: "" },
  subtitle: { ka: "", en: "" },
  description: { ka: "", en: "" },
  coverImageUrl: "",
  instructorName: "",
  price: 0,
  currency: "GEL",
  published: false,
  format: "on_demand",
  sections: [],
  createdAt: "",
  updatedAt: "",
};

const LESSON_TYPES = [
  { value: "video", label: "ვიდეო" },
  { value: "article", label: "სტატია" },
  { value: "quiz", label: "ტესტი" },
];

export default async function AdminCourseEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;

  let course: Course = EMPTY;
  if (id !== "new") {
    const found = await getCourseById(id);
    if (!found) notFound();
    course = found;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-text-primary">{id === "new" ? "ახალი კურსი" : "კურსის რედაქტირება"}</h1>
      {saved && <p className="mt-4 text-sm text-gold">შენახულია.</p>}

      <UploadGateProvider>
        <form action={saveCourseMeta} className="mt-10 flex flex-col gap-8">
          {id !== "new" && <input type="hidden" name="id" value={course.id} />}

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">სათაური</p>
            <div className="mt-2">
              <BilingualInput name="title" ka={course.title.ka} en={course.title.en} />
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">ქვესათაური</p>
            <div className="mt-2">
              <BilingualInput name="subtitle" ka={course.subtitle.ka} en={course.subtitle.en} />
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">აღწერა</p>
            <div className="mt-2">
              <BilingualTextarea name="description" ka={course.description.ka} en={course.description.en} rows={4} />
            </div>
          </div>

          <MediaUploadField
            name="coverImageUrl"
            label="ყდის სურათი"
            defaultValue={course.coverImageUrl}
            accept="image/*"
            hint="რეკომენდებული ზომა: 1200x675px (16:9)"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="ინსტრუქტორი">
              <TextInput name="instructorName" defaultValue={course.instructorName} />
            </Field>
            <Field label="ფასი">
              <TextInput name="price" type="number" step="0.01" defaultValue={course.price} />
            </Field>
            <Field label="ვალუტა">
              <select
                name="currency"
                defaultValue={course.currency}
                className="mt-2 w-full border-b border-hairline bg-transparent py-2 text-text-primary focus:border-gold focus:outline-none"
              >
                <option value="GEL">GEL</option>
                <option value="USD">USD</option>
              </select>
            </Field>
          </div>

          <label className="flex items-center gap-3">
            <input type="checkbox" name="published" defaultChecked={course.published} className="h-4 w-4 accent-[var(--gold)]" />
            <span className="font-mono text-xs uppercase tracking-widest text-text-muted">გამოქვეყნებული</span>
          </label>

          <CourseFormatFields course={course} />

          <div>
            <SaveButton>{id === "new" ? "კურსის შექმნა" : "შენახვა"}</SaveButton>
          </div>
        </form>
      </UploadGateProvider>

      {id !== "new" && (
        <div className="mt-16">
          <h2 className="font-display text-2xl text-text-primary">Curriculum Builder</h2>
          <p className="mt-2 text-text-muted">სექციები და გაკვეთილები, Udemy-ს სტილში.</p>

          <div className="mt-8 flex flex-col gap-6">
            {course.sections
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <div key={section.id} className="border border-hairline bg-surface p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-lg text-text-primary">
                      {section.title.ka || section.title.en || "(უსათაურო სექცია)"}
                    </h3>
                    <form action={removeSection}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input type="hidden" name="sectionId" value={section.id} />
                      <DeleteButton formAction={removeSection}>სექციის წაშლა</DeleteButton>
                    </form>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    {section.lessons
                      .slice()
                      .sort((a, b) => a.order - b.order)
                      .map((lesson) => (
                        <details key={lesson.id} className="border border-hairline bg-ink p-4">
                          <summary className="flex cursor-pointer items-center justify-between gap-4">
                            <span className="text-text-primary">
                              {lesson.title.ka || lesson.title.en || "(უსათაურო გაკვეთილი)"}
                              <span className="ml-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                                · {LESSON_TYPES.find((t) => t.value === lesson.type)?.label ?? lesson.type}
                                {lesson.isPreview ? " · უფასო გადახედვა" : ""}
                              </span>
                            </span>
                            <form action={removeLesson}>
                              <input type="hidden" name="courseId" value={course.id} />
                              <input type="hidden" name="sectionId" value={section.id} />
                              <input type="hidden" name="lessonId" value={lesson.id} />
                              <DeleteButton formAction={removeLesson} stopPropagation>
                                წაშლა
                              </DeleteButton>
                            </form>
                          </summary>

                          <form action={saveLessonMedia} className="mt-4 flex flex-col gap-4">
                            <input type="hidden" name="courseId" value={course.id} />
                            <input type="hidden" name="sectionId" value={section.id} />
                            <input type="hidden" name="lessonId" value={lesson.id} />

                            {lesson.type === "video" && (
                              <BunnyVideoField
                                name="bunnyVideoId"
                                defaultValue={lesson.bunnyVideoId}
                                lessonTitle={lesson.title.ka || lesson.title.en}
                              />
                            )}

                            <PdfUploadField
                              name="pdfUrl"
                              label="დამხმარე PDF (არასავალდებულო)"
                              defaultValue={lesson.pdfUrl}
                            />

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <Field label="ხანგრძლივობა (წამი)">
                                <TextInput name="durationSeconds" type="number" defaultValue={lesson.durationSeconds} />
                              </Field>
                              <label className="mt-8 flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  name="isPreview"
                                  defaultChecked={lesson.isPreview}
                                  className="h-4 w-4 accent-[var(--gold)]"
                                />
                                <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
                                  უფასო გადახედვა
                                </span>
                              </label>
                            </div>

                            <div>
                              <SaveButton>გაკვეთილის შენახვა</SaveButton>
                            </div>
                          </form>
                        </details>
                      ))}

                    {section.lessons.length === 0 && <p className="text-sm text-text-muted">ჯერ არცერთი გაკვეთილი.</p>}
                  </div>

                  <form action={addLesson} className="mt-5 flex flex-wrap items-end gap-3 border-t border-hairline pt-5">
                    <input type="hidden" name="courseId" value={course.id} />
                    <input type="hidden" name="sectionId" value={section.id} />
                    <Field label="ახალი გაკვეთილი">
                      <TextInput name="title" placeholder="გაკვეთილის სათაური" />
                    </Field>
                    <select
                      name="type"
                      defaultValue="video"
                      className="mt-2 border-b border-hairline bg-transparent py-2 text-text-primary focus:border-gold focus:outline-none"
                    >
                      {LESSON_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="border border-hairline px-4 py-2 font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:border-gold hover:text-gold cursor-pointer"
                    >
                      + გაკვეთილის დამატება
                    </button>
                  </form>
                </div>
              ))}

            {course.sections.length === 0 && <p className="text-text-muted">ჯერ არცერთი სექცია არ არის.</p>}

            <form action={addSection} className="flex flex-wrap items-end gap-3 border border-hairline bg-surface p-5">
              <input type="hidden" name="courseId" value={course.id} />
              <Field label="ახალი სექცია">
                <TextInput name="title" placeholder="სექციის სათაური" />
              </Field>
              <button
                type="submit"
                className="bg-gold px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-text-primary cursor-pointer"
              >
                + სექციის დამატება
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
