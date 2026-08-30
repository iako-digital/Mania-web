"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, PlayCircle } from "lucide-react";

interface MyCourse {
  courseId: string;
  title: string;
  percent: number;
}

interface MyPattern {
  patternId: string;
  title: string;
  purchasedAt: string;
}

export function DashboardTabs({ myCourses, myPatterns }: { myCourses: MyCourse[]; myPatterns: MyPattern[] }) {
  const [tab, setTab] = useState<"courses" | "patterns">("courses");

  return (
    <div>
      <div className="flex border-b border-hairline">
        <button
          type="button"
          onClick={() => setTab("courses")}
          className={
            "px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer " +
            (tab === "courses" ? "border-b-2 border-gold text-gold" : "border-b-2 border-transparent text-text-muted hover:text-text-primary")
          }
        >
          ჩემი კურსები
        </button>
        <button
          type="button"
          onClick={() => setTab("patterns")}
          className={
            "px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer " +
            (tab === "patterns" ? "border-b-2 border-gold text-gold" : "border-b-2 border-transparent text-text-muted hover:text-text-primary")
          }
        >
          ჩემი თარგები
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {tab === "courses" &&
          (myCourses.length > 0 ? (
            myCourses.map((c) => (
              <Link
                key={c.courseId}
                href={`/learning/${c.courseId}`}
                className="flex items-center gap-4 border border-hairline bg-surface p-4 transition-colors hover:border-gold"
              >
                <PlayCircle size={20} className="shrink-0 text-gold" />
                <div className="flex-1">
                  <p className="text-text-primary">{c.title}</p>
                  <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-hairline">
                    <div className="h-full bg-gold" style={{ width: `${c.percent}%` }} />
                  </div>
                </div>
                <span className="font-mono text-xs text-text-muted">{c.percent}%</span>
              </Link>
            ))
          ) : (
            <p className="text-text-muted">ჯერ არცერთი კურსი არ გაქვთ შეძენილი.</p>
          ))}

        {tab === "patterns" &&
          (myPatterns.length > 0 ? (
            myPatterns.map((p) => (
              <div key={p.patternId} className="flex items-center gap-4 border border-hairline bg-surface p-4">
                <div className="flex-1">
                  <p className="text-text-primary">{p.title}</p>
                  <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    შეძენილია: {new Date(p.purchasedAt).toLocaleDateString("ka-GE")}
                  </p>
                </div>
                <a
                  href={`/api/dashboard/patterns?download=${p.patternId}`}
                  className="flex items-center gap-2 bg-gold px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-text-primary"
                >
                  <Download size={14} />
                  ჩამოტვირთვა
                </a>
              </div>
            ))
          ) : (
            <p className="text-text-muted">ჯერ არცერთი თარგი არ გაქვთ შეძენილი.</p>
          ))}
      </div>
    </div>
  );
}
