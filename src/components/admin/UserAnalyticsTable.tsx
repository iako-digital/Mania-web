"use client";

import { useMemo, useState } from "react";
import { TextInput } from "./fields";
import type { UserAnalyticsRow } from "@/lib/analytics";

export function UserAnalyticsTable({ rows }: { rows: UserAnalyticsRow[] }) {
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
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-hairline font-mono text-xs uppercase tracking-widest text-text-muted">
              <th className="py-3 pr-4">მოსწავლე</th>
              <th className="py-3 pr-4">რეგისტრაცია</th>
              <th className="py-3 pr-4">შეკვეთები</th>
              <th className="py-3 pr-4">დახარჯული</th>
              <th className="py-3 pr-4">აქტიური წვდომა</th>
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
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-text-muted">
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
