"use client";

import { useRef, useState } from "react";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

// Reuses the site-wide /api/ai-chat endpoint (same one behind the floating
// widget on the public site) rather than a course-specific assistant — a
// per-course knowledge base is a natural next step once courses carry their
// own AI configuration.
export function AiAssistantPanel({ courseTitle }: { courseTitle: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "model", text: `მოგესალმებით! რით შემიძლია დაგეხმაროთ კურსში „${courseTitle}“?` },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const history = messages;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setError(null);
    setSending(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();

      if (!res.ok || typeof data.reply !== "string") {
        setError(data?.error || "პასუხის მიღება ვერ მოხერხდა.");
      } else {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      }
    } catch {
      setError("ქსელის შეცდომა.");
    } finally {
      setSending(false);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }

  return (
    <div className="flex h-[26rem] flex-col">
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="ml-auto max-w-[85%] bg-gold px-3 py-2 text-sm leading-relaxed text-ink">
              {m.text}
            </div>
          ) : (
            <div
              key={i}
              className="max-w-[85%] border border-hairline bg-surface px-3 py-2 text-sm text-text-primary prose prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-1"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{m.text}</ReactMarkdown>
            </div>
          ),
        )}
        {sending && <div className="max-w-[85%] border border-hairline bg-surface px-3 py-2 text-sm text-text-muted">ფიქრობს…</div>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex items-center gap-2 border-t border-hairline pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="დასვით კითხვა…"
          className="flex-1 border-b border-hairline bg-transparent py-1.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          aria-label="გაგზავნა"
          className="flex h-8 w-8 shrink-0 items-center justify-center bg-gold text-ink transition-colors hover:bg-text-primary disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
