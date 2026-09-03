import { getPendingDraftLessons } from "@/lib/draft-lessons/queries";
import { BilingualTextarea, DeleteButton, SaveButton } from "@/components/admin/fields";
import { approveDraft, deleteDraft, generateNow, updateDraft } from "./actions";

export default async function AdminPendingCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const drafts = await getPendingDraftLessons();

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-text-primary">ტაბებას მომზადებული გაკვეთილები</h1>
          <p className="mt-2 text-text-muted">
            Gemini ყოველდღე ავტომატურად ამზადებს ახალ გაკვეთილის დრაფტს ტაბებას პერსონაჟით — გადახედეთ,
            საჭიროებისამებრ ჩაასწორეთ და დაადასტურეთ გამოქვეყნებამდე.
          </p>
        </div>
        <form action={generateNow}>
          <SaveButton>ახლავე გენერირება</SaveButton>
        </form>
      </div>

      {saved && <p className="mt-4 text-sm text-gold">შენახულია.</p>}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-10 flex flex-col gap-4">
        {drafts.length === 0 && <p className="text-text-muted">ჯერ არცერთი დრაფტი არ არის მოლოდინში.</p>}

        {drafts.map((draft) => (
          <details key={draft.id} className="border border-hairline bg-surface p-5">
            <summary className="flex cursor-pointer items-center justify-between gap-4">
              <span className="text-text-primary">
                {draft.title.ka || draft.title.en || "(უსათაურო)"}
                <span className="ml-2 font-mono text-xs uppercase tracking-widest text-text-muted">
                  · {new Date(draft.createdAt).toLocaleDateString("ka-GE")} · {draft.quiz.length} ქვიზის კითხვა
                </span>
              </span>
            </summary>

            <div className="mt-6 flex flex-col gap-6">
              <form action={updateDraft} className="flex flex-col gap-4">
                <input type="hidden" name="id" value={draft.id} />

                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-text-muted">სათაური</p>
                  <div className="mt-2">
                    <BilingualTextarea name="title" ka={draft.title.ka} en={draft.title.en} rows={1} />
                  </div>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-text-muted">საჭირო მასალები</p>
                  <div className="mt-2">
                    <BilingualTextarea
                      name="materialsNeeded"
                      ka={draft.materialsNeeded.ka}
                      en={draft.materialsNeeded.en}
                      rows={3}
                    />
                  </div>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-text-muted">ნაბიჯ-ნაბიჯ ინსტრუქცია</p>
                  <div className="mt-2">
                    <BilingualTextarea
                      name="stepByStepGuide"
                      ka={draft.stepByStepGuide.ka}
                      en={draft.stepByStepGuide.en}
                      rows={6}
                    />
                  </div>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-text-muted">თარგის რჩევები</p>
                  <div className="mt-2">
                    <BilingualTextarea
                      name="patternNotes"
                      ka={draft.patternNotes.ka}
                      en={draft.patternNotes.en}
                      rows={3}
                    />
                  </div>
                </div>

                <div>
                  <SaveButton>ცვლილებების შენახვა</SaveButton>
                </div>
              </form>

              <div className="border-t border-hairline pt-4">
                <p className="font-mono text-xs uppercase tracking-widest text-text-muted">ქვიზი (მხოლოდ გადახედვა)</p>
                <div className="mt-3 flex flex-col gap-4">
                  {draft.quiz.map((q, i) => (
                    <div key={i} className="text-sm">
                      <p className="text-text-primary">
                        {i + 1}. {q.question.ka || q.question.en}
                      </p>
                      <ul className="mt-1 flex flex-col gap-0.5">
                        {q.options.map((opt, oi) => (
                          <li
                            key={oi}
                            className={oi === q.correctIndex ? "text-gold" : "text-text-muted"}
                          >
                            {oi + 1}. {opt.ka || opt.en}
                            {oi === q.correctIndex ? " ✓" : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-hairline pt-4">
                <form action={approveDraft}>
                  <input type="hidden" name="id" value={draft.id} />
                  <button
                    type="submit"
                    className="bg-gold px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-text-primary cursor-pointer"
                  >
                    დადასტურება და გამოქვეყნება
                  </button>
                </form>
                <form action={deleteDraft}>
                  <input type="hidden" name="id" value={draft.id} />
                  <DeleteButton formAction={deleteDraft}>წაშლა</DeleteButton>
                </form>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
