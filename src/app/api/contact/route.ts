import { NextResponse } from "next/server";
import { Resend } from "resend";
import { writeClient } from "@/lib/sanity/client";
import { isSanityConfigured } from "../../../../sanity/env";

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

  let delivered = false;

  if (isSanityConfigured && process.env.SANITY_API_WRITE_TOKEN) {
    try {
      await writeClient.create({
        _type: "contactMessage",
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
        receivedAt: new Date().toISOString(),
        handled: false,
      });
      delivered = true;
    } catch (err) {
      console.error("Failed to store contact message in Sanity:", err);
    }
  }

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
      delivered = true;
    } catch (err) {
      console.error("Failed to send contact notification email:", err);
    }
  }

  if (!delivered) {
    console.error(
      "Contact form submission could not be delivered — configure SANITY_API_WRITE_TOKEN and/or RESEND_API_KEY.",
    );
    return NextResponse.json({ error: "Message could not be delivered" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
