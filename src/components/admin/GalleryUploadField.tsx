"use client";

import { useRef, useState } from "react";
import { uploadManyToCloudinary } from "@/lib/cloudinary-upload";
import { isVideoUrl } from "@/lib/media";
import { useUploadGate } from "./UploadGateContext";
import { Field, inputClass } from "./fields";

const MAX_IMAGES_PER_BATCH = 100;
const MAX_VIDEOS_PER_BATCH = 5;

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
  const [batchTotal, setBatchTotal] = useState(0);
  const [batchProgress, setBatchProgress] = useState<number[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gate = useUploadGate();

  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    setError(null);
    setNotice(null);

    let images = selected.filter((f) => f.type.startsWith("image/"));
    let videos = selected.filter((f) => f.type.startsWith("video/"));
    const skipped = selected.length - images.length - videos.length;

    const warnings: string[] = [];
    if (images.length > MAX_IMAGES_PER_BATCH) {
      warnings.push(`აირჩიეთ ${images.length} სურათი — აიტვირთება პირველი ${MAX_IMAGES_PER_BATCH}.`);
      images = images.slice(0, MAX_IMAGES_PER_BATCH);
    }
    if (videos.length > MAX_VIDEOS_PER_BATCH) {
      warnings.push(`აირჩიეთ ${videos.length} ვიდეო — აიტვირთება პირველი ${MAX_VIDEOS_PER_BATCH}.`);
      videos = videos.slice(0, MAX_VIDEOS_PER_BATCH);
    }
    if (skipped > 0) {
      warnings.push(`${skipped} ფაილი გამოტოვებულია (არც სურათია, არც ვიდეო).`);
    }
    if (warnings.length > 0) setNotice(warnings.join(" "));

    const batch = [...images, ...videos];
    if (batch.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    gate?.begin();
    setBatchTotal(batch.length);
    setBatchProgress(new Array(batch.length).fill(0));

    const results = await uploadManyToCloudinary(batch, {
      concurrency: 4,
      onFileProgress: (index, percent) => {
        setBatchProgress((prev) => {
          const next = [...prev];
          next[index] = percent;
          return next;
        });
      },
    });

    const uploaded = results.filter((r) => r.result).map((r) => r.result!.secureUrl);
    const failedCount = results.filter((r) => r.error).length;

    if (uploaded.length > 0) {
      setUrls((prev) => [...prev, ...uploaded]);
    }
    if (failedCount > 0) {
      setError(`${failedCount} ფაილის ატვირთვა ვერ მოხერხდა.`);
    }

    setBatchTotal(0);
    setBatchProgress([]);
    gate?.end();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  const isUploading = batchTotal > 0;
  const completedCount = batchProgress.filter((p) => p >= 100).length;
  const overallPercent =
    batchProgress.length > 0
      ? Math.round(batchProgress.reduce((sum, p) => sum + p, 0) / batchProgress.length)
      : 0;

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
            ფაილების ატვირთვა (სურათები და ვიდეო)
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFilesChange}
              className="hidden"
            />
          </label>

          {isUploading && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-40 overflow-hidden rounded-full bg-hairline">
                <div
                  className="h-full bg-gold transition-all duration-200"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
              <span className="font-mono text-xs text-text-muted">
                {completedCount}/{batchTotal} · {overallPercent}%
              </span>
            </div>
          )}
        </div>

        <p className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
          მაქსიმუმ {MAX_IMAGES_PER_BATCH} სურათი ან {MAX_VIDEOS_PER_BATCH} ვიდეო ერთ ჯერზე
        </p>

        {notice && <p className="text-xs text-gold">{notice}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}

        {urls.filter(Boolean).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {urls.filter(Boolean).map((u, i) => (
              <div key={`${u}-${i}`} className="group relative h-16 w-16 shrink-0 overflow-hidden border border-hairline bg-ink">
                {isVideoUrl(u) ? (
                  <video src={u} className="h-full w-full object-cover" muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={u} alt="" className="h-full w-full object-cover" />
                )}
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
