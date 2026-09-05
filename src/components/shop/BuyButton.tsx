"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PaymentProvider } from "@/lib/orders/types";

export function BuyButton({
  itemType,
  itemId,
  buyLabel,
  buyingLabel,
  errorLabel,
  promoPlaceholder,
  accessGrantedMessage,
  goToDashboardLabel,
}: {
  itemType: "course" | "pattern";
  itemId: string;
  buyLabel: string;
  buyingLabel: string;
  errorLabel: string;
  promoPlaceholder?: string;
  accessGrantedMessage?: string;
  goToDashboardLabel?: string;
}) {
  const [provider, setProvider] = useState<PaymentProvider>("BOG");
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [granted, setGranted] = useState(false);
  const router = useRouter();

  async function buy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/create-pending-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, itemId, provider, promoCode: promoCode.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok || (!data?.order?.id && !data?.granted)) {
        setError(data?.error || errorLabel);
        return;
      }
      if (data.granted) {
        setGranted(true);
        return;
      }
      router.push(`/checkout/manual-transfer?order=${data.order.id}`);
    } catch {
      setError(errorLabel);
    } finally {
      setLoading(false);
    }
  }

  if (granted) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gold">{accessGrantedMessage}</p>
        <Link
          href="/dashboard"
          className="bg-gold px-6 py-3.5 text-center font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-text-primary"
        >
          {goToDashboardLabel}
        </Link>
      </div>
    );
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

      <input
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
        placeholder={promoPlaceholder}
        className="border-b border-hairline bg-transparent py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-gold focus:outline-none"
      />

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
