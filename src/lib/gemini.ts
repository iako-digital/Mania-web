export interface GeminiTurn {
  role: "user" | "model";
  text: string;
}

export function isGeminiTurn(value: unknown): value is GeminiTurn {
  if (!value || typeof value !== "object") return false;
  const { role, text } = value as Record<string, unknown>;
  return (role === "user" || role === "model") && typeof text === "string";
}

interface CallGeminiParams {
  apiKey: string;
  model?: string;
  systemInstruction?: string;
  contents: { role: "user" | "model"; parts: { text: string }[] }[];
  // For structured output (e.g. quiz generation) — passed through to
  // Gemini's generationConfig as-is.
  generationConfig?: Record<string, unknown>;
}

// Raw fetch to the Gemini generateContent endpoint — no SDK, mirrors the
// original inline call this was extracted from (src/app/api/ai-chat/route.ts).
// Returns the reply text, or throws with a short message safe to surface to
// the caller's own error response.
export async function callGemini({
  apiKey,
  model = process.env.GEMINI_MODEL || "gemini-3.6-flash",
  systemInstruction,
  contents,
  generationConfig,
}: CallGeminiParams): Promise<string> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      contents,
      generationConfig,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("[gemini] request failed:", {
      status: res.status,
      errorText,
      model,
      systemInstruction,
    });
    throw new Error("პასუხის მიღება ვერ მოხერხდა.");
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply || typeof reply !== "string" || !reply.trim()) {
    console.error("[gemini] Invalid response structure:", data);
    throw new Error("პასუხის მიღება ვერ მოხერხდა.");
  }

  return reply.trim();
}
