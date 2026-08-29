import { NextResponse } from "next/server";
import { getAiAssistantContent } from "@/lib/content/queries";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_TURNS = 12;

interface ChatTurn {
  role: "user" | "model";
  text: string;
}

function isChatTurn(value: unknown): value is ChatTurn {
  if (!value || typeof value !== "object") return false;
  const { role, text } = value as Record<string, unknown>;
  return (role === "user" || role === "model") && typeof text === "string";
}

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
  const priorTurns = Array.isArray(history) ? history.filter(isChatTurn).slice(-MAX_HISTORY_TURNS) : [];

  const ai = await getAiAssistantContent();
  if (!ai.enabled) {
    return NextResponse.json({ error: "AI ასისტენტი გამორთულია." }, { status: 503 });
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const systemInstruction = [ai.systemInstructions, ai.knowledgeBase ? `ცოდნის ბაზა:\n${ai.knowledgeBase}` : ""]
    .filter(Boolean)
    .join("\n\n");

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          contents: [
            ...priorTurns.map((turn) => ({ role: turn.role, parts: [{ text: turn.text.slice(0, MAX_MESSAGE_LENGTH) }] })),
            { role: "user", parts: [{ text: trimmedMessage }] },
          ],
        }),
      },
    );

    if (!res.ok) {
      console.error("[ai-chat] Gemini request failed:", res.status, await res.text());
      return NextResponse.json({ error: "პასუხის მიღება ვერ მოხერხდა." }, { status: 502 });
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (typeof reply !== "string" || !reply.trim()) {
      return NextResponse.json({ error: "პასუხის მიღება ვერ მოხერხდა." }, { status: 502 });
    }

    return NextResponse.json({ reply: reply.trim() });
  } catch (err) {
    console.error("[ai-chat] Gemini request error:", err);
    return NextResponse.json({ error: "ქსელის შეცდომა." }, { status: 502 });
  }
}
