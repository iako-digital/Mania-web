"use client";

import { useRef, useState } from "react";
import { ImageIcon, Upload, Video as VideoIcon } from "lucide-react";
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
  const PlaceholderIcon = accept.includes("video") && !accept.includes("image") ? VideoIcon : ImageIcon;

  return (
    <Field label={label}>
      <div className="mt-2 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-hairline bg-ink">
            {url ? (
              isVideo ? (
                <video src={url} className="h-full w-full object-cover" muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="h-full w-full object-cover" />
              )
            ) : (
              <PlaceholderIcon size={22} className="text-text-muted/40" />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="inline-flex w-fit cursor-pointer items-center gap-2 bg-gold px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-text-primary">
              <Upload size={14} />
              ატვირთვა
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

            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>
        </div>

        <TextInput
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder || "ან ჩასვით URL პირდაპირ"}
        />
      </div>
    </Field>
  );
}
