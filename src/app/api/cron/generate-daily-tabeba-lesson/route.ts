import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin/auth";
import { generateTabebaDraftLesson } from "@/lib/draft-lessons/generate";

// Called two ways: (1) the daily scheduled GitHub Actions workflow
// (.github/workflows/tabeba-daily-draft.yml), authenticated with a bearer
// secret since there's no browser session in that context, and (2) the
// "ახლავე გენერირება" button on /admin/pending-courses, authenticated with
// the normal admin session cookie.
export async function POST(request: Request) {
  const secret = process.env.TABEBA_DRAFT_SECRET;
  const authHeader = request.headers.get("authorization");
  const hasValidSecret = Boolean(secret) && authHeader === `Bearer ${secret}`;

  if (!hasValidSecret && !(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Enhanced prompt for generating high-quality educational content
  const systemPrompt = `
    გთხოვთ, შექმნათ მაღალი ხარისხის ყოველდღიური საგანმანათლებლო გაკვეთილი ქართულ ენაზე.
    გაკვეთილი უნდა მოიცავდეს შემდეგ სტრუქტურას:
    {
      "title": "გაკვეთილის სათაური",
      "content": "გაკვეთილის ძირითადი ტექსტი",
      "keyTakeaways": ["მთავარი პუნქტი 1", "მთავარი პუნქტი 2"],
      "exercise": "პრაქტიკული დავალება"
    }
  `;

  try {
    // Generate the draft lesson
    const draft = await generateTabebaDraftLesson(systemPrompt);

    // Save the draft lesson into the database
    const savedDraft = await prisma.draftLesson.create({
      data: {
        title: draft.title,
        content: draft.content,
        keyTakeaways: draft.keyTakeaways,
        exercise: draft.exercise,
      },
    });

    return NextResponse.json({ draft: savedDraft }, { status: 201 });
  } catch (err) {
    console.error("[cron/generate-daily-tabeba-lesson]", err);

    // Fallback response in case of failure
    const fallbackDraft = {
      title: "ნაგულისხმევი გაკვეთილი",
      content: "ეს არის ნაგულისხმევი გაკვეთილის ტექსტი.",
      keyTakeaways: ["ნაგულისხმევი პუნქტი 1", "ნაგულისხმევი პუნქტი 2"],
      exercise: "ნაგულისხმევი პრაქტიკული დავალება.",
    };

    return NextResponse.json(
      { draft: fallbackDraft, error: err instanceof Error ? err.message : "დრაფტის შექმნა ვერ მოხერხდა." },
      { status: 502 },
    );
  }
}




export const dynamic = 'force-dynamic';
