"use client";

import { useRef, useState } from "react";
import { RefreshCw, Upload } from "lucide-react";
import { createBunnyUpload, uploadToBunny } from "@/lib/bunny-upload";
import { useUploadGate } from "./UploadGateContext";
import { Field, TextInput } from "./fields";

// Real Bunny Stream upload: creates the video entry + signed TUS credentials
// server-side (/api/admin/bunny-upload, needs the private API key), then
// streams the file bytes straight from the browser to Bunny over TUS with
// live progress. An existing video can also just be pasted in by GUID.
export function BunnyVideoField({
  name,
  defaultValue = "",
  lessonTitle,
}: {
  name: string;
  defaultValue?: string;
  lessonTitle: string;
}) {
  const [videoId, setVideoId] = useState(defaultValue);
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
      const credentials = await createBunnyUpload(lessonTitle || file.name || "Untitled lesson");
      await uploadToBunny(file, credentials, setProgress);
      setVideoId(credentials.videoId);
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
    <Field label="ვიდეო გაკვეთილი">
      <div className="mt-2 flex flex-col gap-3">
        <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.15em] text-ink transition-colors hover:bg-text-primary disabled:opacity-50 cursor-pointer"
          >
            {videoId ? <RefreshCw size={13} /> : <Upload size={13} />}
            {isUploading ? "იტვირთება…" : videoId ? "ვიდეოს ჩანაცვლება" : "ვიდეოს ატვირთვა"}
          </button>

          {videoId && !isUploading && (
            <span className="font-mono text-xs text-text-muted">GUID: {videoId}</span>
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

        <TextInput
          name={name}
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="ან ჩასვით არსებული ვიდეოს Bunny Stream GUID პირდაპირ"
        />
      </div>
    </Field>
  );
}
