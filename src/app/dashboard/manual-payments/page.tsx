import { getStudentOrders } from "@/lib/orders/queries";
import { getCurrentStudent } from "@/lib/auth/current-student";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { ReceiptUploadForm } from "@/components/dashboard/ReceiptUploadForm";

const STATUS_LABEL: Record<string, string> = {
  pending_payment: "გადახდის მოლოდინში",
  pending_verification: "ქვითარი მოწმდება",
  paid: "დადასტურებული",
  failed: "უარყოფილი",
};

export default async function ManualPaymentsPage() {
  const student = await getCurrentStudent();
  const orders = await getStudentOrders(student.id);

  return (
    <div>
      <DashboardNav active="/dashboard/manual-payments" />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-display text-2xl text-text-primary">შეკვეთები და ქვითრები</h1>
        <p className="mt-2 text-text-muted">ბანკში გადარიცხვის შეკვეთები — ატვირთეთ ქვითარი დასადასტურებლად.</p>

        <div className="mt-8 flex flex-col gap-3">
          {orders.length === 0 && <p className="text-text-muted">ჯერ არცერთი შეკვეთა არ გაქვთ.</p>}

          {orders.map((order) => (
            <div key={order.id} className="flex flex-wrap items-center gap-4 border border-hairline bg-surface p-4">
              <div className="flex-1">
                <p className="text-text-primary">{order.itemTitle}</p>
                <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                  კოდი: {order.orderCode} · {order.amount} {order.currency} ·{" "}
                  <span
                    className={
                      order.status === "paid" ? "text-gold" : order.status === "failed" ? "text-red-400" : "text-text-muted"
                    }
                  >
                    {STATUS_LABEL[order.status]}
                  </span>
                </p>
              </div>

              {order.status === "pending_payment" && <ReceiptUploadForm orderId={order.id} />}
              {order.status === "pending_verification" && order.receiptUrl && (
                <a
                  href={order.receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold"
                >
                  ატვირთული ქვითარი ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
