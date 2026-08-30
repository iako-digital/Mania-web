import { FileText } from "lucide-react";
import { getPendingVerificationOrders } from "@/lib/orders/queries";
import { ApproveOrderButton } from "@/components/admin/ApproveOrderButton";
import { DeleteButton } from "@/components/admin/fields";
import { rejectOrder } from "./actions";

export default async function AdminVerificationsPage() {
  const orders = await getPendingVerificationOrders();

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl text-text-primary">გადახდის დადასტურება</h1>
      <p className="mt-2 text-text-muted">ატვირთული ქვითრები ბანკში გადარიცხვის შეკვეთებზე — დაადასტურეთ ან უარყავით.</p>

      <div className="mt-10 flex flex-col gap-3">
        {orders.length === 0 && <p className="text-text-muted">ამჟამად შესამოწმებელი ქვითარი არ არის.</p>}

        {orders.map((order) => (
          <div key={order.id} className="flex flex-wrap items-center gap-4 border border-hairline bg-surface p-4">
            <div className="flex-1">
              <p className="text-text-primary">{order.itemTitle}</p>
              <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                {order.studentName} · {order.studentEmail} · {order.amount} {order.currency} · კოდი: {order.orderCode}
              </p>
            </div>

            {order.receiptUrl && (
              <a
                href={order.receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 border border-hairline px-3 py-2 text-xs text-text-muted hover:text-gold"
              >
                <FileText size={14} />
                ქვითრის ნახვა
              </a>
            )}

            <ApproveOrderButton orderId={order.id} />

            <form action={rejectOrder}>
              <input type="hidden" name="orderId" value={order.id} />
              <DeleteButton formAction={rejectOrder}>Reject</DeleteButton>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
