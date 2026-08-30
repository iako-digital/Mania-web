"use client";

import { useState } from "react";
import { Field, TextInput } from "./fields";

interface BunnyCredentials {
  videoId: string;
  libraryId: string;
  expiration: number;
  signature: string;
  tusEndpoint: string;
}

// Manual-bind field for a lesson's Bunny Stream video. "Generate" calls
// /api/admin/bunny-upload to create the video entry on Bunny and return a
// signed TUS upload credential set — actually pushing the file bytes to
// Bunny needs a TUS client (e.g. tus-js-client) wired to these credentials,
// which is outside this scaffold's scope. Existing videos can also just be
// pasted in by GUID.
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
  const [credentials, setCredentials] = useState<BunnyCredentials | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/bunny-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: lessonTitle || "Untitled lesson" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "ვერ მოხერხდა.");
        return;
      }
      setCredentials(data);
      setVideoId(data.videoId);
    } catch {
      setError("ქსელის შეცდომა.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Field label="Bunny Stream ვიდეო GUID">
      <div className="mt-2 flex flex-col gap-2">
        <div className="flex gap-2">
          <TextInput
            name={name}
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            placeholder="არსებული ვიდეოს GUID, ან შექმენით ახალი →"
            className="mt-0"
          />
          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className="shrink-0 whitespace-nowrap border border-hairline px-4 py-2 font-mono text-xs uppercase tracking-widest text-text-muted transition-colors hover:border-gold hover:text-gold disabled:opacity-50 cursor-pointer"
          >
            {loading ? "იქმნება…" : "ახლის შექმნა"}
          </button>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        {credentials && (
          <pre className="overflow-x-auto border border-hairline bg-ink p-3 text-[11px] text-text-muted">
{JSON.stringify(credentials, null, 2)}
          </pre>
        )}
        <p className="text-xs text-text-muted/70">
          „ახლის შექმნა“ ამზადებს ატვირთვის Signature-ს Bunny Stream-ისთვის (TUS resumable upload) — რეალურად
          ფაილის ატვირთვას ესაჭიროება TUS client, აქ ჩვენებულია დამაკავშირებელი მონაცემები.
        </p>
      </div>
    </Field>
  );
}
