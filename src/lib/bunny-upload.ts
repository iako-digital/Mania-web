"use client";

import { Upload } from "tus-js-client";

export const MAX_VIDEO_SIZE_BYTES = 5 * 1024 * 1024 * 1024; // 5GB

export interface BunnyUploadCredentials {
  videoId: string;
  libraryId: string;
  expiration: number;
  signature: string;
  tusEndpoint: string;
}

// Step 1: server creates the video entry on Bunny and signs a TUS
// credential set (needs the private API key, so it can't happen client-side).
export async function createBunnyUpload(title: string): Promise<BunnyUploadCredentials> {
  const res = await fetch("/api/admin/bunny-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "ვერ მოხერხდა ატვირთვის მომზადება.");
  return data as BunnyUploadCredentials;
}

// Step 2: the file bytes go straight from the browser to Bunny over TUS
// (resumable upload), using the signed credentials from step 1 — the API
// key itself never reaches the browser. See:
// https://docs.bunny.net/docs/stream-uploading#tus-resumable-uploads
export function uploadToBunny(
  file: File,
  credentials: BunnyUploadCredentials,
  onProgress: (percent: number) => void,
): Promise<void> {
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    const actualGb = (file.size / (1024 * 1024 * 1024)).toFixed(2);
    return Promise.reject(new Error(`ფაილის ზომა აღემატება დაშვებულ ლიმიტს (მაქს. 5GB). თქვენი ფაილი: ${actualGb} GB.`));
  }

  return new Promise((resolve, reject) => {
    const upload = new Upload(file, {
      endpoint: credentials.tusEndpoint,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        AuthorizationSignature: credentials.signature,
        AuthorizationExpire: String(credentials.expiration),
        VideoId: credentials.videoId,
        LibraryId: credentials.libraryId,
      },
      metadata: {
        filetype: file.type,
        title: file.name,
      },
      onError: (error) => reject(error instanceof Error ? error : new Error(String(error))),
      onProgress: (bytesUploaded, bytesTotal) => {
        onProgress(Math.round((bytesUploaded / bytesTotal) * 100));
      },
      onSuccess: () => resolve(),
    });
    upload.start();
  });
}
