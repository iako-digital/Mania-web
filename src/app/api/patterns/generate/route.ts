import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
function generateSVGDiagram(step: string): string {
  return `<svg><text>${step}</text></svg>`;
}
import { getYouTubeSearchUrl } from "@/lib/youtube";

export async function POST(request: Request) {
  const { userId, patternCategory, steps } = await request.json();

  // Atomic user credit check and consumption
  const user = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: { patternCredits: true, purchases: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.patternCredits <= 0 && !user.purchases.some((p) => p.category === patternCategory)) {
      throw new Error("Insufficient credits or no approved purchase");
    }

    if (user.patternCredits > 0) {
      await tx.user.update({
        where: { id: userId },
        data: { patternCredits: user.patternCredits - 1 },
      });
    }

    return user;
  }).catch((error) => {
    return NextResponse.json({ error: error.message }, { status: 403 });
  });

  if (!user) return;

  // AI generation system prompt in Georgian
  const systemPrompt = `
    გთხოვთ, შექმნათ დეტალური ნიმუში შემდეგი კატეგორიისთვის: ${patternCategory}.
    ნიმუშის აღწერა უნდა იყოს ქართულ ენაზე და მოიცავდეს შემდეგ სტრუქტურას:
    {
      "title": "ნიმუშის სათაური",
      "description": "ნიმუშის დეტალური აღწერა",
      "materials": ["მასალა 1", "მასალა 2"],
      "steps": [
        { "stepNumber": 1, "description": "პირველი ნაბიჯი" },
        { "stepNumber": 2, "description": "მეორე ნაბიჯი" }
      ],
      "measurements": { "width": "სიგანე", "height": "სიმაღლე" },
      "svgData": "<svg>...</svg>"
    }
  `;

  let aiGeneratedPattern;
  try {
    // Simulate AI generation call (replace with actual AI call)
    aiGeneratedPattern = await generatePatternWithAI(systemPrompt, steps);
  } catch {
    // Fallback to default pattern
    aiGeneratedPattern = {
      title: "ნიმუშის ნაგულისხმევი სათაური",
      description: "ეს არის ნიმუშის ნაგულისხმევი აღწერა.",
      materials: ["ნაგულისხმევი მასალა 1", "ნაგულისხმევი მასალა 2"],
      steps: [
        { stepNumber: 1, description: "ნაგულისხმევი პირველი ნაბიჯი" },
        { stepNumber: 2, description: "ნაგულისხმევი მეორე ნაბიჯი" },
      ],
      measurements: { width: "10 სმ", height: "20 სმ" },
      svgData: "<svg><text>ნაგულისხმევი ნიმუში</text></svg>",
    };
  }

  return NextResponse.json(aiGeneratedPattern);
}





export const dynamic = 'force-dynamic';
