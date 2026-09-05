"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PromoCodeForm({ orderId }: { orderId: string }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const router = useRouter();

  async function apply() {
    if (!code.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/checkout/apply-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data?.error || "კოდი არასწორია." });
        return;
      }
      if (data.granted) {
        router.push("/dashboard/manual-payments");
        return;
      }
      setMessage({ type: "success", text: "კოდი გააქტიურდა — ფასი განახლდა." });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "დაფიქსირდა შეცდომა. სცადეთ თავიდან." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 border-t border-hairline pt-6">
      <p className="font-mono text-xs uppercase tracking-widest text-text-muted">პრომო კოდი</p>
      <div className="mt-3 flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="მაგ: SALE20"
          className="flex-1 border-b border-hairline bg-transparent py-2 text-text-primary placeholder:text-text-muted/50 focus:border-gold focus:outline-none"
        />
        <button
          type="button"
          onClick={apply}
          disabled={loading}
          className="border border-hairline px-4 py-2 font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:border-gold hover:text-gold disabled:opacity-50 cursor-pointer"
        >
          {loading ? "მოწმდება…" : "გააქტიურება"}
        </button>
      </div>
      {message && (
        <p className={`mt-2 text-xs ${message.type === "error" ? "text-red-400" : "text-gold"}`}>{message.text}</p>
      )}
    </div>
  );
}
