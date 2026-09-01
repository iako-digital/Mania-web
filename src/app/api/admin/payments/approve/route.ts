import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { paymentId, action } = await request.json();

  if (!paymentId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { user: true },
  });

  if (!payment || payment.status !== "Pending Approval") {
    return NextResponse.json({ error: "Payment not found or already processed" }, { status: 404 });
  }

  if (action === "approve") {
    const creditsToAdd = payment.amount / 10; // Example: 1 credit per 10 units of amount
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: { status: "Approved" },
      }),
      prisma.user.update({
        where: { id: payment.userId },
        data: { patternCredits: { increment: creditsToAdd } },
      }),
    ]);
    return NextResponse.json({ success: true });
  } else if (action === "reject") {
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "Rejected" },
    });
    return NextResponse.json({ success: true });
  }
}
