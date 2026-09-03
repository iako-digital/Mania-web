import { NextResponse } from "next/server";
import { getAiAssistantContent } from "@/lib/content/queries";
import { callGemini, isGeminiTurn } from "@/lib/gemini";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_TURNS = 12;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI ასისტენტი დროებით მიუწვდომელია (GEMINI_API_KEY არ არის კონფიგურირებული)." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { message, history } = (body ?? {}) as Record<string, unknown>;

  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const trimmedMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH);
  const priorTurns = Array.isArray(history) ? history.filter(isGeminiTurn).slice(-MAX_HISTORY_TURNS) : [];

  const ai = await getAiAssistantContent();
  if (!ai.enabled) {
    return NextResponse.json({ error: "AI ასისტენტი გამორთულია." }, { status: 503 });
  }

  const systemInstruction = [ai.systemInstructions, ai.knowledgeBase ? `ცოდნის ბაზა:\n${ai.knowledgeBase}` : ""]
    .filter(Boolean)
    .join("\n\n");

  try {
    const reply = await callGemini({
      apiKey,
      systemInstruction: systemInstruction || undefined,
      contents: [
        ...priorTurns.map((turn) => ({ role: turn.role, parts: [{ text: turn.text.slice(0, MAX_MESSAGE_LENGTH) }] })),
        { role: "user" as const, parts: [{ text: trimmedMessage }] },
      ],
    });
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[ai-chat] Gemini request error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "ქსელის შეცდომა." }, { status: 502 });
  }
}
