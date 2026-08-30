import { getOrders, sumRevenue } from "@/lib/orders/queries";

const PROVIDER_LABEL: Record<string, string> = { BOG: "საქართველოს ბანკი", TBC: "თიბისი ბანკი" };
const STATUS_LABEL: Record<string, string> = {
  pending_payment: "გადახდის მოლოდინში",
  pending_verification: "მოწმდება",
  paid: "გადახდილი",
  failed: "წარუმატებელი",
};
const ITEM_TYPE_LABEL: Record<string, string> = { course: "კურსი", pattern: "თარგი" };

export default async function AdminSalesPage() {
  const orders = await getOrders();
  const totalRevenue = sumRevenue(orders);
  const byItemType = (["course", "pattern"] as const).map((itemType) => ({
    itemType,
    total: sumRevenue(orders.filter((o) => o.itemType === itemType)),
  }));

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-3xl text-text-primary">გაყიდვები</h1>
      <p className="mt-2 text-text-muted">
        შემოსავლების ანალიტიკა კურსებსა და თარგებზე (BOG / TBC, ბანკში გადარიცხვით). შეკვეთები ინახება{" "}
        <code>content/orders.json</code>-ში — ახალი „მოწმდება“ სტატუსის შეკვეთები დასადასტურებელია{" "}
        <code>/admin/verifications</code>-ზე.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border border-hairline bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">სულ შემოსავალი</p>
          <p className="mt-2 font-display text-3xl text-gold">{totalRevenue} ₾</p>
        </div>
        {byItemType.map(({ itemType, total }) => (
          <div key={itemType} className="border border-hairline bg-surface p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{ITEM_TYPE_LABEL[itemType]}</p>
            <p className="mt-2 font-display text-3xl text-text-primary">{total} ₾</p>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-hairline font-mono text-xs uppercase tracking-widest text-text-muted">
              <th className="py-3 pr-4">თარიღი</th>
              <th className="py-3 pr-4">მოსწავლე</th>
              <th className="py-3 pr-4">პროდუქტი</th>
              <th className="py-3 pr-4">ტიპი</th>
              <th className="py-3 pr-4">ბანკი</th>
              <th className="py-3 pr-4">სტატუსი</th>
              <th className="py-3 pr-4 text-right">თანხა</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-hairline/50">
                <td className="py-3 pr-4 text-sm text-text-muted">{new Date(order.createdAt).toLocaleDateString("ka-GE")}</td>
                <td className="py-3 pr-4 text-sm text-text-primary">{order.studentName}</td>
                <td className="py-3 pr-4 text-sm text-text-muted">{order.itemTitle}</td>
                <td className="py-3 pr-4 text-sm text-text-muted">{ITEM_TYPE_LABEL[order.itemType]}</td>
                <td className="py-3 pr-4 text-sm text-text-muted">{PROVIDER_LABEL[order.provider] ?? order.provider}</td>
                <td className="py-3 pr-4 text-sm">
                  <span
                    className={
                      order.status === "paid"
                        ? "text-gold"
                        : order.status === "failed"
                          ? "text-red-400"
                          : "text-text-muted"
                    }
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-right text-sm text-text-primary">
                  {order.amount} {order.currency}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-text-muted">
                  ჯერ არცერთი შეკვეთა არ არის.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
