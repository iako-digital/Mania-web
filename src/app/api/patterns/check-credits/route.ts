import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId }: { userId: string } = await request.json();

  const user = await prisma.user.findUnique<{ id: string; patternCredits: number; purchases: { status: string }[] }>({
    where: { id: userId },
    include: { patternCredits: true, purchases: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const hasCredits = user.patternCredits > 0;
  const hasApprovedPurchase = user.purchases.some((purchase) => purchase.status === "COMPLETED");

  if (hasCredits || hasApprovedPurchase) {
    return NextResponse.json({ allowed: true });
  }

  return NextResponse.json({ allowed: false });
}





export const dynamic = 'force-dynamic';
