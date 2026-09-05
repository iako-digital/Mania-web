"use client";

import { useRef, useState } from "react";
import { ImageIcon, RefreshCw, Trash2, Upload, Video as VideoIcon } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { isVideoUrl, optimizeCloudinaryUrl } from "@/lib/media";
import { useUploadGate } from "./UploadGateContext";
import { Field, TextInput } from "./fields";

export function MediaUploadField({
  name,
  label,
  defaultValue = "",
  accept = "image/*,video/*",
  placeholder,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  accept?: string;
  placeholder?: string;
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

  function handleDelete() {
    setUrl("");
    setError(null);
  }

  const isUploading = progress !== null;
  const isVideo = isVideoUrl(url);
  const PlaceholderIcon = accept.includes("video") && !accept.includes("image") ? VideoIcon : ImageIcon;

  return (
    <Field label={label}>
      <div className="mt-2 flex flex-col gap-3">
        {hint && <p className="text-xs text-neutral-400 mt-1">{hint}</p>}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-wrap items-center gap-4">
          {url ? (
            <div className="group relative h-24 w-24 shrink-0 overflow-hidden border border-hairline bg-ink">
              {isVideo ? (
                <video src={url} className="h-full w-full object-cover" muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={optimizeCloudinaryUrl(url)} alt="" className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/0 opacity-0 transition-all duration-200 group-hover:bg-ink/80 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="ჩანაცვლება"
                  aria-label="ჩანაცვლება"
                  className="rounded-full bg-gold p-2 text-ink transition-colors hover:bg-text-primary cursor-pointer"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  title="წაშლა"
                  aria-label="წაშლა"
                  className="rounded-full bg-red-400/90 p-2 text-ink transition-colors hover:bg-red-400 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center border border-hairline bg-ink">
              <PlaceholderIcon size={22} className="text-text-muted/40" />
            </div>
          )}

          <div className="flex flex-col gap-2">
            {!url && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex w-fit items-center gap-2 bg-gold px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-text-primary cursor-pointer"
              >
                <Upload size={14} />
                ატვირთვა
              </button>
            )}

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
