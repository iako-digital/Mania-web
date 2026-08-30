"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApproveOrderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function approve() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/approve-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "ვერ დადასტურდა.");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={approve}
        disabled={loading}
        className="bg-gold px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-text-primary disabled:opacity-50 cursor-pointer"
      >
        {loading ? "მუშავდება…" : "Approve"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
