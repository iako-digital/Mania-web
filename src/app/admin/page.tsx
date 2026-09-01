import { requireSuperAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  await requireSuperAdmin();

  const [pendingPayments, totalUsers, totalPatterns, pendingApprovals] = await Promise.all([
    prisma.payment.findMany({
      where: { status: "Pending Approval" },
      include: { user: true },
    }),
    prisma.user.count(),
    prisma.pattern.count(),
    prisma.payment.count({ where: { status: "Pending Approval" } }),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ადმინის დაფა</h1>

      <div className="mb-6">
        <h2 className="text-lg font-bold">სისტემის სტატისტიკა</h2>
        <ul>
          <li>მომხმარებლები: {totalUsers}</li>
          <li>გენერირებული პატერნები: {totalPatterns}</li>
          <li>მომლოდინე გადახდები: {pendingApprovals}</li>
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-bold">მომლოდინე გადახდები</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">ელ. ფოსტა</th>
              <th className="border border-gray-300 p-2">რეფერენს კოდი</th>
              <th className="border border-gray-300 p-2">თანხა</th>
              <th className="border border-gray-300 p-2">თარიღი</th>
              <th className="border border-gray-300 p-2">მოქმედება</th>
            </tr>
          </thead>
          <tbody>
            {pendingPayments.map((payment) => (
              <tr key={payment.id}>
                <td className="border border-gray-300 p-2">{payment.user.email}</td>
                <td className="border border-gray-300 p-2">{payment.referenceCode}</td>
                <td className="border border-gray-300 p-2">{payment.amount} ლარი</td>
                <td className="border border-gray-300 p-2">
                  {new Date(payment.createdAt).toLocaleDateString("ka-GE")}
                </td>
                <td className="border border-gray-300 p-2">
                  <form method="POST" action="/api/admin/payments/approve">
                    <input type="hidden" name="paymentId" value={payment.id} />
                    <button
                      type="submit"
                      name="action"
                      value="approve"
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      დადასტურება
                    </button>
                    <button
                      type="submit"
                      name="action"
                      value="reject"
                      className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                    >
                      უარყოფა
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
