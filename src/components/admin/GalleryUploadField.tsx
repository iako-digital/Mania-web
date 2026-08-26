"use client";

import { useRef, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { useUploadGate } from "./UploadGateContext";
import { Field, inputClass } from "./fields";

export function GalleryUploadField({
  name,
  label,
  defaultValue = [],
}: {
  name: string;
  label: string;
  defaultValue?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [activeUploads, setActiveUploads] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gate = useUploadGate();

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError(null);
    gate?.begin();
    setActiveUploads(files.length);

    const results = await Promise.allSettled(
      files.map((file) => uploadToCloudinary(file, () => {})),
    );

    const uploaded = results
      .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof uploadToCloudinary>>> => r.status === "fulfilled")
      .map((r) => r.value.secureUrl);
    const failedCount = results.length - uploaded.length;

    if (uploaded.length > 0) {
      setUrls((prev) => [...prev, ...uploaded]);
    }
    if (failedCount > 0) {
      setError(`${failedCount} ფაილის ატვირთვა ვერ მოხერხდა.`);
    }

    setActiveUploads(0);
    gate?.end();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  const isUploading = activeUploads > 0;

  return (
    <Field label={label}>
      <div className="mt-2 flex flex-col gap-3">
        <textarea
          name={name}
          value={urls.join("\n")}
          onChange={(e) => setUrls(e.target.value.split("\n"))}
          rows={4}
          className={`${inputClass} resize-none`}
        />

        <div className="flex flex-wrap items-center gap-4">
          <label className="cursor-pointer border border-hairline px-4 py-2 font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:border-gold hover:text-gold">
            ფაილების ატვირთვა
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesChange}
              className="hidden"
            />
          </label>
          {isUploading && (
            <span className="font-mono text-xs text-text-muted">იტვირთება {activeUploads} ფაილი…</span>
          )}
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        {urls.filter(Boolean).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {urls.filter(Boolean).map((u, i) => (
              <div key={`${u}-${i}`} className="group relative h-16 w-16 shrink-0 overflow-hidden border border-hairline bg-ink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute inset-0 hidden items-center justify-center bg-ink/85 font-mono text-[10px] uppercase tracking-widest text-red-400 group-hover:flex cursor-pointer"
                >
                  წაშლა
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Field>
  );
}
