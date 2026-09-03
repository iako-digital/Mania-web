"use client";

import { type ReactNode, useState } from "react";

const TABS = [
  { id: "overview", label: "მიმოხილვა" },
  { id: "qa", label: "კითხვა-პასუხი" },
  { id: "ai", label: "AI ასისტენტი" },
  { id: "quiz", label: "ქვიზი" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function PlayerTabs({
  overview,
  qa,
  ai,
  quiz,
}: {
  overview: ReactNode;
  qa: ReactNode;
  ai: ReactNode;
  quiz: ReactNode;
}) {
  const [active, setActive] = useState<TabId>("overview");
  const panels: Record<TabId, ReactNode> = { overview, qa, ai, quiz };

  return (
    <div>
      <div className="flex border-b border-hairline">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={
              "px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer " +
              (active === tab.id
                ? "border-b-2 border-gold text-gold"
                : "border-b-2 border-transparent text-text-muted hover:text-text-primary")
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6">{panels[active]}</div>
    </div>
  );
}
