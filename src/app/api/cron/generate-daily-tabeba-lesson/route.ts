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

  try {
    const draft = await generateTabebaDraftLesson();
    return NextResponse.json({ draft }, { status: 201 });
  } catch (err) {
    console.error("[cron/generate-daily-tabeba-lesson]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "დრაფტის შექმნა ვერ მოხერხდა." },
      { status: 502 },
    );
  }
}




export const dynamic = 'force-dynamic';
