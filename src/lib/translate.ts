// Auto-translates Georgian admin input into English via the Gemini API, so
// the site owner (who only reads/writes Georgian) never has to fill in the
// English field herself. Requires GEMINI_API_KEY — without it, saves still
// work fine, they just leave English blank until it's set manually.

async function translateToEnglish(georgianText: string): Promise<string> {
  const text = georgianText.trim();
  if (!text) return "";

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "";

  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Translate the following Georgian text into natural, professional English, suitable for a fashion/pattern-making portfolio website. Reply with only the translated text — no notes, no quotation marks.\n\n${text}`,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!res.ok) {
      console.error("[translate] Gemini request failed:", res.status, await res.text());
      return "";
    }

    const data = await res.json();
    const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof translated === "string" ? translated.trim() : "";
  } catch (err) {
    console.error("[translate] Gemini request error:", err);
    return "";
  }
}

// Resolves a {ka, en} pair for a form submission: if English was left blank
// and Georgian was provided, auto-translates. An already-filled English
// value is always preserved as-is.
export async function resolveLocaleString(ka: string, en: string): Promise<{ ka: string; en: string }> {
  const trimmedKa = ka.trim();
  const trimmedEn = en.trim();

  if (trimmedEn || !trimmedKa) {
    return { ka: trimmedKa, en: trimmedEn };
  }

  const auto = await translateToEnglish(trimmedKa);
  return { ka: trimmedKa, en: auto || trimmedEn };
}
