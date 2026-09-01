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

  return NextResponse.json({ success: true, payment });
}
