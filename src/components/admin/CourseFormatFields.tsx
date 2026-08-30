"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { BilingualInput, BilingualTextarea, Field, TextInput } from "./fields";
import type { Course, CourseFormat, LiveSessionSlot } from "@/lib/courses/types";

const FORMAT_OPTIONS: { value: CourseFormat; label: string }[] = [
  { value: "on_demand", label: "ჩაწერილი ვიდეო" },
  { value: "live", label: "ლაივ გაკვეთილები აუდიტორიაში" },
  { value: "ai_tutor", label: "AI ინსტრუქტორი" },
];

// Owns the show/hide state for format-conditional fields. All inputs here
// are plain named form fields that submit through the parent Server
// Component page's <form action={saveCourseMeta}> — the closures (row
// add/remove, format switch) live entirely inside this "use client" leaf,
// never passed down from the server-rendered page (same rule that fixed the
// DeleteButton/stopPropagation bug in the Curriculum Builder).
export function CourseFormatFields({ course }: { course: Course }) {
  const [format, setFormat] = useState<CourseFormat>(course.format);
  const [sessions, setSessions] = useState<LiveSessionSlot[]>(course.liveDetails?.sessions ?? []);
  const [aiTutorEnabled, setAiTutorEnabled] = useState(course.aiTutor?.enabled ?? false);

  function addSession() {
    setSessions((s) => [...s, { id: crypto.randomUUID(), date: "", startTime: "", endTime: "" }]);
  }

  function updateSession(id: string, patch: Partial<LiveSessionSlot>) {
    setSessions((s) => s.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function removeSession(id: string) {
    setSessions((s) => s.filter((row) => row.id !== id));
  }

  return (
    <div className="flex flex-col gap-6 border border-hairline bg-surface p-6">
      <Field label="სწავლების ფორმატი">
        <select
          name="format"
          value={format}
          onChange={(e) => setFormat(e.target.value as CourseFormat)}
          className="mt-2 w-full border-b border-hairline bg-transparent py-2 text-text-primary focus:border-gold focus:outline-none"
        >
          {FORMAT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      {format === "live" && (
        <div className="flex flex-col gap-4 border-t border-hairline pt-6">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">ლაივ გაკვეთილის დეტალები</p>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">მდებარეობა</p>
            <div className="mt-2">
              <BilingualInput
                name="liveLocation"
                ka={course.liveDetails?.location.ka}
                en={course.liveDetails?.location.en}
              />
            </div>
          </div>

          <Field label="ადგილების რაოდენობა">
            <TextInput name="liveCapacity" type="number" min={0} defaultValue={course.liveDetails?.capacity ?? 0} />
          </Field>

          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">განრიგი</p>
            {sessions.map((row) => (
              <div key={row.id} className="flex flex-wrap items-end gap-3">
                <Field label="თარიღი">
                  <TextInput
                    type="date"
                    value={row.date}
                    onChange={(e) => updateSession(row.id, { date: e.target.value })}
                  />
                </Field>
                <Field label="დაწყება">
                  <TextInput
                    type="time"
                    value={row.startTime}
                    onChange={(e) => updateSession(row.id, { startTime: e.target.value })}
                  />
                </Field>
                <Field label="დასრულება">
                  <TextInput
                    type="time"
                    value={row.endTime}
                    onChange={(e) => updateSession(row.id, { endTime: e.target.value })}
                  />
                </Field>
                <button
                  type="button"
                  onClick={() => removeSession(row.id)}
                  aria-label="განრიგის მწკრივის წაშლა"
                  className="mb-2 text-text-muted hover:text-red-400 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSession}
              className="inline-flex w-fit items-center gap-2 border border-hairline px-4 py-2 font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:border-gold hover:text-gold cursor-pointer"
            >
              <Plus size={14} />
              განრიგის დამატება
            </button>
          </div>

          <input type="hidden" name="liveSessionsJson" value={JSON.stringify(sessions)} readOnly />
        </div>
      )}

      {format !== "live" && (
        <div className="border-t border-hairline pt-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="aiTutorEnabled"
              checked={format === "ai_tutor" ? true : aiTutorEnabled}
              disabled={format === "ai_tutor"}
              onChange={(e) => setAiTutorEnabled(e.target.checked)}
              className="h-4 w-4 accent-[var(--gold)]"
            />
            <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
              AI ინსტრუქტორის ჩართვა {format === "ai_tutor" && "(სავალდებულო ამ ფორმატისთვის)"}
            </span>
          </label>

          {(format === "ai_tutor" || aiTutorEnabled) && (
            <div className="mt-4">
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                დამატებითი ცოდნის ბაზა (არასავალდებულო)
              </p>
              <p className="mt-1 text-xs text-text-muted/70">
                AI ინსტრუქტორი ისედაც ეყრდნობა კურსის სათაურს, აღწერას და გაკვეთილების მასალას — აქ შეგიძლიათ დაამატოთ
                დამატებითი კონტექსტი ან ინსტრუქციები.
              </p>
              <div className="mt-2">
                <BilingualTextarea
                  name="aiTutorKnowledgeBase"
                  ka={course.aiTutor?.knowledgeBase?.ka}
                  en={course.aiTutor?.knowledgeBase?.en}
                  rows={4}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
