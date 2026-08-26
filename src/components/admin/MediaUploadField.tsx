"use client";

import { useRef, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { isVideoUrl } from "@/lib/media";
import { useUploadGate } from "./UploadGateContext";
import { Field, TextInput } from "./fields";

export function MediaUploadField({
  name,
  label,
  defaultValue = "",
  accept = "image/*,video/*",
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  accept?: string;
  placeholder?: string;
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
  const isVideo = isVideoUrl(url);

  return (
    <Field label={label}>
      <div className="mt-2 flex flex-col gap-3">
        <TextInput
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder}
        />

        <div className="flex flex-wrap items-center gap-4">
          <label className="cursor-pointer border border-hairline px-4 py-2 font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:border-gold hover:text-gold">
            ფაილის ატვირთვა
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {isUploading && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-hairline">
                <div
                  className="h-full bg-gold transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-xs text-text-muted">{progress}%</span>
            </div>
          )}

          {url && !isUploading && (
            <div className="h-16 w-16 shrink-0 overflow-hidden border border-hairline bg-ink">
              {isVideo ? (
                <video src={url} className="h-full w-full object-cover" muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    </Field>
  );
}
