"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Trash2, Upload } from "lucide-react";
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
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string[];
  hint?: string;
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
    const failed = results.filter((r) => r.error);

    if (uploaded.length > 0) {
      setUrls((prev) => [...prev, ...uploaded]);
    }
    if (failed.length > 0) {
      const uniqueReasons = Array.from(new Set(failed.map((r) => r.error)));
      setError(`${failed.length} ფაილის ატვირთვა ვერ მოხერხდა: ${uniqueReasons.slice(0, 2).join(" ")}`);
    }

    setBatchTotal(0);
    setBatchProgress([]);
    gate?.end();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function moveBy(index: number, delta: number) {
    setUrls((prev) => {
      const target = index + delta;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
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
        {hint && <p className="text-xs text-neutral-400 mt-1">{hint}</p>}
        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex w-fit cursor-pointer items-center gap-2 bg-gold px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-text-primary">
            <Upload size={14} />
            ფაილების ატვირთვა
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
          სურათები და ვიდეო ერთად — მაქსიმუმ {MAX_IMAGES_PER_BATCH} სურათი ან {MAX_VIDEOS_PER_BATCH} ვიდეო ერთ ჯერზე
        </p>

        {notice && <p className="text-xs text-gold">{notice}</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}

        {urls.filter(Boolean).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {urls.filter(Boolean).map((u, i, arr) => (
              <div key={`${u}-${i}`} className="group relative h-20 w-20 shrink-0 overflow-hidden border border-hairline bg-ink">
                {isVideoUrl(u) ? (
                  <video src={u} className="h-full w-full object-cover" muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={u} alt="" className="h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-between bg-ink/0 p-1 opacity-0 transition-all duration-200 group-hover:bg-ink/80 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    title="წაშლა"
                    aria-label="წაშლა"
                    className="rounded-full bg-red-400/90 p-1.5 text-ink transition-colors hover:bg-red-400 cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveBy(i, -1)}
                      disabled={i === 0}
                      title="ერთით მარცხნივ"
                      aria-label="ერთით მარცხნივ"
                      className="rounded-full bg-gold p-1 text-ink transition-colors hover:bg-text-primary disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBy(i, 1)}
                      disabled={i === arr.length - 1}
                      title="ერთით მარჯვნივ"
                      aria-label="ერთით მარჯვნივ"
                      className="rounded-full bg-gold p-1 text-ink transition-colors hover:bg-text-primary disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
            URL-ების სია (ავტომატურად ივსება ატვირთვისას — ხელითაც შეგიძლიათ ჩასწოროთ)
          </span>
          <textarea
            name={name}
            value={urls.join("\n")}
            onChange={(e) => setUrls(e.target.value.split("\n"))}
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </label>
      </div>
    </Field>
  );
}
