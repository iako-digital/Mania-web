import { prisma } from "@/lib/prisma";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({ where: { status: "PENDING" } });

  const handleApprove = async (id: string): Promise<void> => {
    await fetch(`/api/admin/payments/approve/${id}`, { method: "POST" });
    alert("Payment approved!");
  };

  return (
    <div className="admin-payments-page">
      <h1>Pending Payments</h1>
      <ul>
        {payments.map((payment: { id: string; name: string; transactionCode: string; referenceCode: string }) => (
          <li key={payment.id}>
            <p>Name: {payment.name}</p>
            <p>Transaction Code: {payment.transactionCode}</p>
            <p>Reference Code: {payment.referenceCode}</p>
            <button onClick={() => handleApprove(payment.id)}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const dynamic = 'force-dynamic';
