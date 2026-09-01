import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { name, transactionCode, referenceCode } = await request.json();

  if (!name || !transactionCode || !referenceCode) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const payment = await prisma.payment.create({
    data: {
      name,
      transactionCode,
      referenceCode,
      status: "PENDING",
    },
  });

  // Notify admin via email
  const adminEmail = "info@mania.com.ge";
  const emailPayload = {
    to: adminEmail,
    subject: "New Manual Payment Request",
    text: `A new manual payment request has been submitted:
    - Reference Code: ${referenceCode}
    - User Name: ${name}
    - Transaction Code: ${transactionCode}
    - Status: PENDING`,
  };

  // Simulate email sending (replace with actual email service logic)
  console.log("Sending email to admin:", emailPayload);

  return NextResponse.json({ success: true, payment });
}
