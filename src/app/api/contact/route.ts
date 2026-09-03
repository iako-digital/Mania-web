import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, message } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !message.trim() ||
    !EMAIL_RE.test(email)
  ) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const trimmedName = name.trim().slice(0, 200);
  const trimmedEmail = email.trim().slice(0, 200);
  const trimmedMessage = message.trim().slice(0, 5000);
  const receivedAt = new Date().toISOString();

  // Always logged (visible in your host's function logs) as a baseline
  // audit trail, independent of whether email delivery is configured.
  console.log(
    "[contact]",
    JSON.stringify({ name: trimmedName, email: trimmedEmail, message: trimmedMessage, receivedAt }),
  );

  if (process.env.RESEND_API_KEY && process.env.CONTACT_NOTIFICATION_EMAIL) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev",
        to: process.env.CONTACT_NOTIFICATION_EMAIL,
        replyTo: trimmedEmail,
        subject: `New inquiry from ${trimmedName}`,
        text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\n\n${trimmedMessage}`,
      });
    } catch (err) {
      console.error("[contact] Resend delivery failed:", err);
      return NextResponse.json({ error: "Message could not be emailed" }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true });
}
