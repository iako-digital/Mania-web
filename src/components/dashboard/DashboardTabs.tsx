"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Download, PlayCircle } from "lucide-react";

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

export interface MyOrder {
  orderCode: string;
  itemTitle: string;
  amount: number;
  currency: string;
  status: "pending_payment" | "pending_verification" | "paid" | "failed";
}

export interface MyNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

const ORDER_STATUS_LABEL: Record<MyOrder["status"], string> = {
  pending_payment: "მოლოდინში",
  pending_verification: "მოწმდება",
  paid: "დადასტურებული",
  failed: "უარყოფილი",
};

export function DashboardTabs({
  myCourses,
  myPatterns,
  myOrders,
  myNotifications,
}: {
  myCourses: MyCourse[];
  myPatterns: MyPattern[];
  myOrders: MyOrder[];
  myNotifications: MyNotification[];
}) {
  const [tab, setTab] = useState<"courses" | "patterns" | "payments" | "notifications">("courses");
  const unreadCount = myNotifications.filter((n) => !n.read).length;

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
        <button
          type="button"
          onClick={() => setTab("payments")}
          className={
            "px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer " +
            (tab === "payments" ? "border-b-2 border-gold text-gold" : "border-b-2 border-transparent text-text-muted hover:text-text-primary")
          }
        >
          გადახდები
        </button>
        <button
          type="button"
          onClick={() => setTab("notifications")}
          className={
            "flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer " +
            (tab === "notifications" ? "border-b-2 border-gold text-gold" : "border-b-2 border-transparent text-text-muted hover:text-text-primary")
          }
        >
          <Bell size={13} />
          შეტყობინებები
          {unreadCount > 0 && <span className="rounded-full bg-gold px-1.5 py-0.5 text-[10px] text-ink">{unreadCount}</span>}
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

        {tab === "payments" &&
          (myOrders.length > 0 ? (
            myOrders.map((o) => (
              <div key={o.orderCode} className="flex items-center gap-4 border border-hairline bg-surface p-4">
                <div className="flex-1">
                  <p className="text-text-primary">{o.itemTitle}</p>
                  <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                    კოდი: {o.orderCode} · {o.amount} {o.currency}
                  </p>
                </div>
                <span
                  className={
                    "font-mono text-xs uppercase tracking-widest " +
                    (o.status === "paid" ? "text-gold" : o.status === "failed" ? "text-red-400" : "text-text-muted")
                  }
                >
                  {ORDER_STATUS_LABEL[o.status]}
                </span>
              </div>
            ))
          ) : (
            <p className="text-text-muted">ჯერ არცერთი გადახდა არ გაქვთ.</p>
          ))}

        {tab === "notifications" &&
          (myNotifications.length > 0 ? (
            myNotifications.map((n) => <NotificationRow key={n.id} notification={n} />)
          ) : (
            <p className="text-text-muted">ჯერ არცერთი შეტყობინება არ გაქვთ.</p>
          ))}
      </div>
    </div>
  );
}

function NotificationRow({ notification }: { notification: MyNotification }) {
  const [read, setRead] = useState(notification.read);

  async function markRead() {
    if (read) return;
    setRead(true);
    try {
      await fetch("/api/dashboard/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notification.id }),
      });
    } catch {
      // Best-effort — the notification stays visually read either way.
    }
  }

  return (
    <button
      type="button"
      onClick={markRead}
      className={
        "flex flex-col items-start gap-1 border p-4 text-left transition-colors " +
        (read ? "border-hairline bg-surface" : "border-gold/60 bg-surface cursor-pointer")
      }
    >
      <div className="flex w-full items-center justify-between gap-3">
        <p className="text-text-primary">{notification.title}</p>
        {!read && <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />}
      </div>
      <p className="text-sm text-text-muted">{notification.body}</p>
      <p className="font-mono text-xs uppercase tracking-widest text-text-muted/70">
        {new Date(notification.createdAt).toLocaleDateString("ka-GE")}
      </p>
    </button>
  );
}
