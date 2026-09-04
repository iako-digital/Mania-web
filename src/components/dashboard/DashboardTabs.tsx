"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, Download, PlayCircle } from "lucide-react";
import { BuyButton } from "@/components/shop/BuyButton";

type ProductStatus = "available" | "pending" | "active";
type PendingOrderStatus = "pending_payment" | "pending_verification";

interface MyCourse {
  courseId: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  status: ProductStatus;
  percent?: number;
  orderStatus?: PendingOrderStatus;
}

interface MyPattern {
  patternId: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  status: ProductStatus;
  purchasedAt?: string;
  orderStatus?: PendingOrderStatus;
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

const PENDING_LABEL: Record<PendingOrderStatus, string> = {
  pending_payment: "გადახდის მოლოდინში",
  pending_verification: "ქვითარი ატვირთულია — მოწმდება",
};

function ProductCode({ code }: { code: string }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted/70">{code}</span>
  );
}

function PendingCard({ title, code, orderStatus }: { title: string; code: string; orderStatus: PendingOrderStatus }) {
  return (
    <div className="flex items-center gap-4 border border-hairline bg-surface p-4">
      <div className="flex-1">
        <p className="text-text-primary">{title}</p>
        <ProductCode code={code} />
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-gold">{PENDING_LABEL[orderStatus]}</p>
      </div>
      <Link
        href="/dashboard/manual-payments"
        className="shrink-0 border border-hairline px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:border-gold hover:text-gold"
      >
        დეტალები
      </Link>
    </div>
  );
}

function AvailableCard({
  title,
  code,
  price,
  currency,
  itemType,
  itemId,
}: {
  title: string;
  code: string;
  price: number;
  currency: string;
  itemType: "course" | "pattern";
  itemId: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 border border-hairline bg-surface p-4">
      <div className="flex-1">
        <p className="text-text-primary">{title}</p>
        <ProductCode code={code} />
        <p className="mt-1 text-gold">
          {price} {currency}
        </p>
      </div>
      <BuyButton itemType={itemType} itemId={itemId} buyLabel="ყიდვა" buyingLabel="მიმდინარეობს…" errorLabel="ვერ მოხერხდა." />
    </div>
  );
}

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
      <div className="flex flex-wrap border-b border-hairline">
        <button
          type="button"
          onClick={() => setTab("courses")}
          className={
            "px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer " +
            (tab === "courses" ? "border-b-2 border-gold text-gold" : "border-b-2 border-transparent text-text-muted hover:text-text-primary")
          }
        >
          კურსები
        </button>
        <button
          type="button"
          onClick={() => setTab("patterns")}
          className={
            "px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer " +
            (tab === "patterns" ? "border-b-2 border-gold text-gold" : "border-b-2 border-transparent text-text-muted hover:text-text-primary")
          }
        >
          თარგები
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
            myCourses.map((c) => {
              if (c.status === "active") {
                return (
                  <Link
                    key={c.courseId}
                    href={`/learning/${c.courseId}`}
                    className="flex items-center gap-4 border border-hairline bg-surface p-4 transition-colors hover:border-gold"
                  >
                    <PlayCircle size={20} className="shrink-0 text-gold" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-text-primary">{c.title}</p>
                        <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-gold">
                          <CheckCircle2 size={11} /> აქტიური
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-hairline">
                        <div className="h-full bg-gold" style={{ width: `${c.percent ?? 0}%` }} />
                      </div>
                    </div>
                    <span className="font-mono text-xs text-text-muted">{c.percent ?? 0}%</span>
                  </Link>
                );
              }
              if (c.status === "pending") {
                return <PendingCard key={c.courseId} title={c.title} code={c.slug} orderStatus={c.orderStatus!} />;
              }
              return (
                <AvailableCard
                  key={c.courseId}
                  title={c.title}
                  code={c.slug}
                  price={c.price}
                  currency={c.currency}
                  itemType="course"
                  itemId={c.courseId}
                />
              );
            })
          ) : (
            <p className="text-text-muted">ჯერ არცერთი კურსი არ არის.</p>
          ))}

        {tab === "patterns" &&
          (myPatterns.length > 0 ? (
            myPatterns.map((p) => {
              if (p.status === "active") {
                return (
                  <div key={p.patternId} className="flex items-center gap-4 border border-hairline bg-surface p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-text-primary">{p.title}</p>
                        <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-gold">
                          <CheckCircle2 size={11} /> აქტიური
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-text-muted">
                        შეძენილია: {p.purchasedAt ? new Date(p.purchasedAt).toLocaleDateString("ka-GE") : "—"}
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
                );
              }
              if (p.status === "pending") {
                return <PendingCard key={p.patternId} title={p.title} code={p.slug} orderStatus={p.orderStatus!} />;
              }
              return (
                <AvailableCard
                  key={p.patternId}
                  title={p.title}
                  code={p.slug}
                  price={p.price}
                  currency={p.currency}
                  itemType="pattern"
                  itemId={p.patternId}
                />
              );
            })
          ) : (
            <p className="text-text-muted">ჯერ არცერთი თარგი არ არის.</p>
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
