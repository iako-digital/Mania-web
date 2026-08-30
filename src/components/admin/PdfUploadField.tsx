"use client";

import { useRef, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { useUploadGate } from "./UploadGateContext";
import { Field, TextInput } from "./fields";

export function PdfUploadField({
  name,
  label,
  defaultValue = "",
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gate = useUploadGate();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProgress(0);
    gate?.begin();

    try {
      const result = await uploadToCloudinary(file, setProgress);
      setUrl(result.secureUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ატვირთვა ვერ მოხერხდა.");
    } finally {
      setProgress(null);
      gate?.end();
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const isUploading = progress !== null;

  return (
    <Field label={label}>
      <div className="mt-2 flex flex-col gap-3">
        {hint && <p className="text-xs text-neutral-400">{hint}</p>}

        <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />

        <div className="flex flex-wrap items-center gap-3">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 border border-hairline bg-ink px-3 py-2 text-xs text-text-muted hover:text-gold"
            >
              <FileText size={14} />
              PDF ფაილი
            </a>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-text-primary cursor-pointer"
          >
            <Upload size={13} />
            {url ? "ჩანაცვლება" : "ატვირთვა"}
          </button>

          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              aria-label="წაშლა"
              className="text-text-muted hover:text-red-400 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {isUploading && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-hairline">
              <div className="h-full bg-gold transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
            <span className="font-mono text-xs text-text-muted">{progress}%</span>
          </div>
        )}

        {error && <p className="text-xs text-red-400">{error}</p>}

        <TextInput name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="ან ჩასვით URL პირდაპირ" />
      </div>
    </Field>
  );
}
