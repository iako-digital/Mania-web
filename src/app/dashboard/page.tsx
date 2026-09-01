import { getCurrentStudent } from "@/lib/auth/current-student";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const student = await getCurrentStudent();
  const user = await prisma.user.findUnique({
    where: { id: student.id },
    include: {
      patternCredits: true,
      purchases: { include: { pattern: true } },
      manualPayments: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const myPatterns = user.purchases.map((purchase: { pattern: { id: string; title: { ka?: string; en?: string }; steps: string; tutorialLink?: string }; createdAt: string }) => ({
    patternId: purchase.pattern.id,
    title: purchase.pattern.title.ka || purchase.pattern.title.en,
    purchasedAt: purchase.createdAt,
    steps: purchase.pattern.steps,
    tutorialLink: purchase.pattern.tutorialLink,
  }));

  const manualPayments = user.manualPayments.map((payment: { id: string; status: string; amount: number; createdAt: string }) => ({
    id: payment.id,
    status: payment.status,
    amount: payment.amount,
    createdAt: payment.createdAt,
  }));

  return (
    <div>
      <DashboardNav active="/dashboard" />

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="border border-hairline bg-surface p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">პროფილი</p>
          <p className="mt-2 text-lg text-text-primary">{student.name}</p>
          <p className="text-sm text-text-muted">{student.email}</p>
        </div>

        <div className="mt-8">
          <div className="border border-hairline bg-surface p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">კრედიტები</p>
            <p className="mt-2 text-lg text-text-primary">{user.patternCredits} კრედიტი</p>
            {user.patternCredits === 0 && (
              <a href="/checkout" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded">
                შეიძინეთ კრედიტები
              </a>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-text-primary">შეძენილი პატერნები</h2>
          <ul className="mt-4 space-y-4">
            {myPatterns.map((pattern) => (
              <li key={pattern.patternId} className="border border-hairline bg-surface p-4">
                <p className="text-text-primary">{pattern.title}</p>
                <p className="text-sm text-text-muted">შეძენის თარიღი: {new Date(pattern.purchasedAt).toLocaleDateString("ka-GE")}</p>
                <p className="text-sm text-text-muted">საფეხურები: {pattern.steps}</p>
                {pattern.tutorialLink && (
                  <a href={pattern.tutorialLink} className="text-primary underline">
                    გაკვეთილი
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-text-primary">ხელით გადახდები</h2>
          <ul className="mt-4 space-y-4">
            {manualPayments.map((payment) => (
              <li key={payment.id} className="border border-hairline bg-surface p-4">
                <p className="text-text-primary">თანხა: {payment.amount} ლარი</p>
                <p className="text-sm text-text-muted">თარიღი: {new Date(payment.createdAt).toLocaleDateString("ka-GE")}</p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-bold rounded ${
                    payment.status === "Pending Approval" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"
                  }`}
                >
                  {payment.status === "Pending Approval" ? "მოლოდინში" : "დამტკიცებული"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
