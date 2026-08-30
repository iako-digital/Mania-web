"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";

export function ReceiptUploadForm({ orderId }: { orderId: string }) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProgress(0);

    try {
      const uploaded = await uploadToCloudinary(file, setProgress);
      const res = await fetch("/api/checkout/upload-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, receiptUrl: uploaded.secureUrl }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "ვერ აიტვირთა.");
        return;
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ატვირთვა ვერ მოხერხდა.");
    } finally {
      setProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const isUploading = progress !== null;

  return (
    <div className="flex flex-col gap-2">
      <input ref={fileInputRef} type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 bg-gold px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-text-primary disabled:opacity-50 cursor-pointer"
      >
        <Upload size={14} />
        {isUploading ? `იტვირთება… ${progress}%` : "ქვითრის ატვირთვა"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
