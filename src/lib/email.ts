import { Resend } from "resend";

// Same degrade-gracefully approach as /api/contact: every notification is
// always logged server-side, and actually emailed only when RESEND_API_KEY
// is configured — so the checkout/verification flow works end-to-end in
// dev without any email provider set up.
export async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }): Promise<void> {
  console.log("[email]", JSON.stringify({ to, subject }));

  if (!process.env.RESEND_API_KEY) return;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev",
      to,
      subject,
      text,
    });
  } catch (err) {
    console.error("[email] Resend delivery failed:", err);
  }
}

function adminEmail(): string | null {
  return process.env.CONTACT_NOTIFICATION_EMAIL || null;
}

export async function notifyAdminNewReceipt(params: {
  orderCode: string;
  itemTitle: string;
  studentName: string;
  amount: number;
  currency: string;
}): Promise<void> {
  const to = adminEmail();
  if (!to) return;
  await sendEmail({
    to,
    subject: `ახალი ქვითარი ატვირთულია — შეკვეთა ${params.orderCode}`,
    text: `${params.studentName}-მა ატვირთა გადახდის ქვითარი „${params.itemTitle}“-ისთვის (${params.amount} ${params.currency}).\n\nშეამოწმეთ /admin/verifications გვერდზე.`,
  });
}

export async function notifyStudentVerificationPending(params: { to: string; orderCode: string; itemTitle: string }): Promise<void> {
  await sendEmail({
    to: params.to,
    subject: `ვამოწმებთ თქვენს ქვითარს — შეკვეთა ${params.orderCode}`,
    text: `მადლობა! თქვენი გადახდის ქვითარი „${params.itemTitle}“-ისთვის მიღებულია და მოწმდება. წვდომას მიიღებთ დადასტურებისთანავე.`,
  });
}

export async function notifyStudentAccessGranted(params: { to: string; itemTitle: string }): Promise<void> {
  await sendEmail({
    to: params.to,
    subject: `წვდომა გახსნილია — ${params.itemTitle}`,
    text: `თქვენი გადახდა დადასტურდა! ახლა შეგიძლიათ ისარგებლოთ „${params.itemTitle}“-ით თქვენს პირად კაბინეტში: /dashboard`,
  });
}
