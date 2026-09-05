"use client";

import { useMemo, useState } from "react";
import { TextInput, inputClass, SaveButton } from "./fields";
import type { UserAnalyticsRow } from "@/lib/analytics";

export interface ProductOption {
  id: string;
  title: string;
}

export function UserAnalyticsTable({
  rows,
  courseOptions,
  patternOptions,
  changePasswordAction,
  grantAccessAction,
}: {
  rows: UserAnalyticsRow[];
  courseOptions: ProductOption[];
  patternOptions: ProductOption[];
  changePasswordAction: (formData: FormData) => void | Promise<void>;
  grantAccessAction: (formData: FormData) => void | Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (onlyActive && r.activeAccessCount === 0) return false;
      if (!q) return true;
      return r.email.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
    });
  }, [rows, query, onlyActive]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="w-64">
          <TextInput
            placeholder="ძებნა ელ-ფოსტით ან სახელით…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <label className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyActive}
            onChange={(e) => setOnlyActive(e.target.checked)}
            className="h-4 w-4 accent-[var(--gold)]"
          />
          <span className="font-mono text-xs uppercase tracking-widest text-text-muted">მხოლოდ აქტიური წვდომით</span>
        </label>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-hairline font-mono text-xs uppercase tracking-widest text-text-muted">
              <th className="py-3 pr-4">მოსწავლე</th>
              <th className="py-3 pr-4">რეგისტრაცია</th>
              <th className="py-3 pr-4">შეკვეთები</th>
              <th className="py-3 pr-4">დახარჯული</th>
              <th className="py-3 pr-4">აქტიური წვდომა</th>
              <th className="py-3 pr-4">მოქმედებები</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.studentId} className="border-b border-hairline/50">
                <td className="py-3 pr-4">
                  <p className="text-sm text-text-primary">{r.name || "—"}</p>
                  <p className="text-xs text-text-muted">{r.email || r.studentId}</p>
                </td>
                <td className="py-3 pr-4 text-sm text-text-muted">
                  {new Date(r.registeredAt).toLocaleDateString("ka-GE")}
                </td>
                <td className="py-3 pr-4 text-sm text-text-muted">{r.totalOrders}</td>
                <td className="py-3 pr-4 text-sm text-text-muted">{r.totalSpent} GEL</td>
                <td className="py-3 pr-4">
                  <span className={"font-mono text-xs " + (r.activeAccessCount > 0 ? "text-gold" : "text-text-muted")}>
                    {r.activeAccessCount}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <details>
                    <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold">
                      პაროლის შეცვლა
                    </summary>
                    <form action={changePasswordAction} className="mt-2 flex w-56 flex-col gap-2">
                      <input type="hidden" name="email" value={r.email || r.studentId} />
                      <TextInput
                        name="password"
                        type="password"
                        placeholder="ახალი პაროლი (მინ. 6 სიმბოლო)"
                        minLength={6}
                        required
                      />
                      <SaveButton>შენახვა</SaveButton>
                    </form>
                  </details>

                  <details className="mt-2">
                    <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold">
                      წვდომის მინიჭება
                    </summary>
                    <form action={grantAccessAction} className="mt-2 flex w-56 flex-col gap-2">
                      <input type="hidden" name="email" value={r.email || r.studentId} />
                      <input type="hidden" name="name" value={r.name || r.email || r.studentId} />
                      <select name="target" required defaultValue="" className={inputClass}>
                        <option value="" disabled>
                          აირჩიეთ პროდუქტი
                        </option>
                        <optgroup label="კურსები">
                          {courseOptions.map((c) => (
                            <option key={c.id} value={`course:${c.id}`}>
                              {c.title}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="თარგები">
                          {patternOptions.map((p) => (
                            <option key={p.id} value={`pattern:${p.id}`}>
                              {p.title}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      <SaveButton>წვდომის გახსნა</SaveButton>
                    </form>
                  </details>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-text-muted">
                  არაფერი მოიძებნა.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
