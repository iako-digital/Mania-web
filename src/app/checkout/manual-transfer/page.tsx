import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Landmark } from "lucide-react";
import { getOrderById } from "@/lib/orders/queries";
import { getBankAccounts } from "@/lib/payments/bank-accounts";

export default async function ManualTransferCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  if (!orderId) notFound();

  const order = await getOrderById(orderId);
  if (!order) notFound();

  const accounts = getBankAccounts();
  const preferred = accounts.find((a) => a.provider === order.provider) ?? accounts[0];

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <div className="border border-hairline bg-surface p-8">
        <div className="flex items-center gap-3">
          <Landmark size={22} className="text-gold" />
          <h1 className="font-display text-2xl text-text-primary">გადახდა ბანკის გადარიცხვით</h1>
        </div>
        <p className="mt-3 text-text-muted">
          გადარიცხეთ <span className="text-text-primary">{order.amount} {order.currency}</span> ქვემოთ მითითებულ
          ანგარიშზე, აუცილებლად მიუთითეთ დანიშნულებაში შეკვეთის კოდი — ეს არის ერთადერთი გზა, რომ თქვენი გადახდა
          სწრაფად მოინახოს.
        </p>

        <div className="mt-8 border-t border-hairline pt-6">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">პროდუქტი</p>
          <p className="mt-1 text-text-primary">{order.itemTitle}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">შეკვეთის კოდი</p>
            <p className="mt-1 font-mono text-lg text-gold">{order.orderCode}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">თანხა</p>
            <p className="mt-1 text-lg text-text-primary">{order.amount} {order.currency}</p>
          </div>
        </div>

        <div className="mt-8 border-t border-hairline pt-6">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">ანგარიშის მონაცემები</p>
          {preferred?.iban ? (
            <div className="mt-3 space-y-1 text-sm text-text-primary">
              <p>{preferred.bankName}</p>
              {preferred.accountHolder && <p>მიმღები: {preferred.accountHolder}</p>}
              <p className="font-mono">{preferred.iban}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-text-muted">
              საბანკო ანგარიშის ნომერი ჯერ არ არის კონფიგურირებული (BOG_ACCOUNT_IBAN / TBC_ACCOUNT_IBAN).
            </p>
          )}
        </div>

        <Link
          href="/dashboard/manual-payments"
          className="mt-10 flex items-center justify-center gap-2 bg-gold px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-text-primary"
        >
          <CheckCircle2 size={16} />
          გადავრიცხე — ქვითრის ატვირთვა
        </Link>
      </div>
    </div>
  );
}
