import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
function generateSVGDiagram(step: string): string {
  return `<svg><text>${step}</text></svg>`;
}
import { getYouTubeSearchUrl } from "@/lib/youtube";

export async function POST(request: Request) {
  const { userId, patternCategory, steps } = await request.json();

  // Check user credits
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { patternCredits: true, purchases: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.patternCredits <= 0 && !user.purchases.some(p => p.category === patternCategory)) {
    return NextResponse.json({ error: "Insufficient credits or no approved purchase" }, { status: 403 });
  }

  // Deduct one credit if credits are available
  if (user.patternCredits > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { patternCredits: user.patternCredits - 1 },
    });
  }

  // Smart fallback logic for video tutorials
  const videoTutorial = await prisma.videoTutorial.findFirst({
    where: { tags: { has: patternCategory } },
  });

  const videoUrl = videoTutorial
    ? videoTutorial.videoUrl
    : getYouTubeSearchUrl(`how to ${patternCategory} ${steps.join(", ")}`);

  // Generate step-by-step SVG diagrams
  const diagrams = steps.map((step: string) => generateSVGDiagram(step));

  // Include 5x5 cm test box notice
  const testBoxNotice = "Ensure a 5x5 cm test box is included for accurate scaling.";

  return NextResponse.json({
    videoUrl,
    diagrams,
    testBoxNotice,
  });
}





export const dynamic = 'force-dynamic';
