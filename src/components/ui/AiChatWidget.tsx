"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export function AiChatWidget({ welcomeMessage }: { welcomeMessage: string }) {
  const t = useTranslations("aiChat");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "model", text: welcomeMessage }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const history = messages;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setError(null);
    setSending(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();

      if (!res.ok || typeof data.reply !== "string") {
        setError(data?.error || t("errorGeneric"));
      } else {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      }
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setSending(false);
      scrollToBottom();
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-[92vw] max-w-[calc(100vw-3rem)] flex-col overflow-hidden border border-hairline bg-surface shadow-xl shadow-black/40 sm:w-[420px]">
          <div className="flex items-start justify-between border-b border-hairline bg-ink px-4 py-3">
            <div>
              <p className="font-display text-base text-text-primary">{t("title")}</p>
              <p className="mt-0.5 text-[11px] text-text-muted">
                Powered by{" "}
                <a
                  href="https://www.cdc.org.ge/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  CDC Studio
                </a>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("title")}
              className="text-text-muted hover:text-gold transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="ml-auto max-w-[85%] bg-gold px-3 py-2 text-sm leading-relaxed text-ink">
                  {m.text}
                </div>
              ) : (
                <div
                  key={i}
                  className="max-w-[85%] border border-hairline bg-ink px-3 py-2 text-text-primary prose prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-1 text-sm"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                </div>
              ),
            )}
            {sending && (
              <div className="max-w-[85%] border border-hairline bg-ink px-3 py-2 text-sm text-text-muted">
                {t("thinking")}
              </div>
            )}
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-hairline p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 border-b border-hairline bg-transparent py-1.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label={t("send")}
              className="flex h-8 w-8 shrink-0 items-center justify-center bg-gold text-ink transition-colors hover:bg-text-primary disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("openLabel")}
        title={t("openLabel")}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-text-primary text-ink shadow-lg shadow-black/30 transition-transform duration-300 hover:scale-110"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
