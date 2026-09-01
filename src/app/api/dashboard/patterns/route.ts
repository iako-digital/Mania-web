import { NextResponse } from "next/server";
import { getCurrentStudent } from "@/lib/auth/current-student";
import { getPatternById, getPatternPurchases, getStudentPatternPurchases, savePatternPurchases } from "@/lib/patterns/queries";

// GET with no query: list the demo student's purchased patterns.
// GET ?download=<patternId>: verifies the purchase (and that access hasn't
// been revoked), bumps the download counter, and redirects to the actual
// PDF — this indirection is what makes the download "secure": the real
// pdfUrl is never exposed to a browsing student who hasn't paid.
export async function GET(request: Request) {
  const downloadPatternId = new URL(request.url).searchParams.get("download");
  const student = await getCurrentStudent();

  if (!downloadPatternId) {
    const purchases = await getStudentPatternPurchases(student.id);
    return NextResponse.json({ purchases });
  }

  const purchases = await getPatternPurchases();
  const purchase = purchases.find((p) => p.patternId === downloadPatternId && p.studentId === student.id);
  if (!purchase || purchase.accessRevoked) {
    return NextResponse.json({ error: "No access to this pattern" }, { status: 403 });
  }

  const pattern = await getPatternById(downloadPatternId);
  if (!pattern?.pdfUrl) {
    return NextResponse.json({ error: "File not available" }, { status: 404 });
  }

  purchase.downloadCount += 1;
  await savePatternPurchases(purchases);

  return NextResponse.redirect(pattern.pdfUrl);
}




export const dynamic = 'force-dynamic';
