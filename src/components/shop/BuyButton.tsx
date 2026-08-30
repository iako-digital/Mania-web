"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PaymentProvider } from "@/lib/orders/types";

export function BuyButton({
  itemType,
  itemId,
  buyLabel,
  buyingLabel,
  errorLabel,
}: {
  itemType: "course" | "pattern";
  itemId: string;
  buyLabel: string;
  buyingLabel: string;
  errorLabel: string;
}) {
  const [provider, setProvider] = useState<PaymentProvider>("BOG");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/create-pending-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, itemId, provider }),
      });
      const data = await res.json();
      if (!res.ok || !data?.order?.id) {
        setError(data?.error || errorLabel);
        return;
      }
      router.push(`/checkout/manual-transfer?order=${data.order.id}`);
    } catch {
      setError(errorLabel);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {(["BOG", "TBC"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setProvider(p)}
            className={
              "flex-1 border px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer " +
              (provider === p ? "border-gold text-gold" : "border-hairline text-text-muted hover:text-text-primary")
            }
          >
            {p} გადარიცხვა
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={buy}
        disabled={loading}
        className="bg-gold px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-text-primary disabled:opacity-50 cursor-pointer"
      >
        {loading ? buyingLabel : buyLabel}
      </button>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
