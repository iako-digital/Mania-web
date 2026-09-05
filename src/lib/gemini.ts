export interface GeminiTurn {
  role: "user" | "model";
  text: string;
}

export function isGeminiTurn(value: unknown): value is GeminiTurn {
  if (!value || typeof value !== "object") return false;
  const { role, text } = value as Record<string, unknown>;
  return (role === "user" || role === "model") && typeof text === "string";
}

// A part is either plain text or inline binary data (e.g. a receipt image/
// PDF for vision requests) — Gemini accepts a mix of both within one turn.
export type GeminiPart = { text: string } | { inlineData: { mimeType: string; data: string } };

interface CallGeminiParams {
  apiKey: string;
  model?: string;
  systemInstruction?: string;
  contents: { role: "user" | "model"; parts: GeminiPart[] }[];
  // For structured output (e.g. quiz generation) — passed through to
  // Gemini's generationConfig as-is.
  generationConfig?: Record<string, unknown>;
}

const REQUEST_TIMEOUT_MS = 25_000;

// Raw fetch to the Gemini generateContent endpoint — no SDK, mirrors the
// original inline call this was extracted from (src/app/api/ai-chat/route.ts).
// Returns the reply text, or throws with a short message safe to surface to
// the caller's own error response. A hard timeout means a hung upstream
// request fails fast with a clear message instead of leaving the UI's
// "thinking…" state hanging until the platform's own (much longer, and not
// user-facing-friendly) request timeout kicks in.
export async function callGemini({
  apiKey,
  model = process.env.GEMINI_MODEL || "gemini-3.6-flash",
  systemInstruction,
  contents,
  generationConfig,
}: CallGeminiParams): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        contents,
        generationConfig,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("პასუხის მიღება ძალიან დიდხანს გრძელდება — სცადეთ ისევ.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    console.error("[gemini] request failed:", res.status, await res.text());
    if (res.status === 429) {
      throw new Error("ბევრი მოთხოვნაა ამ დროისთვის — სცადეთ ცოტა ხანში ისევ.");
    }
    throw new Error("პასუხის მიღება ვერ მოხერხდა.");
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof reply !== "string" || !reply.trim()) {
    throw new Error("პასუხის მიღება ვერ მოხერხდა.");
  }

  return reply.trim();
}
