"use client";

export const MAX_IMAGE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
export const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024; // 500MB

const SIZE_LIMIT_MESSAGE =
  "ფაილის ზომა აღემატება დაშვებულ ლიმიტს (ფოტო: მაქს. 50MB, ვიდეო: მაქს. 500MB).";

export interface CloudinaryUploadResult {
  secureUrl: string;
  resourceType: "image" | "video" | "raw";
}

// Unsigned direct-to-Cloudinary upload from the browser — no server round
// trip for the file itself, with real upload progress via XHR (fetch has no
// upload progress event).
export function uploadToCloudinary(
  file: File,
  onProgress: (percent: number) => void,
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return Promise.reject(
      new Error(
        "Cloudinary არ არის კონფიგურირებული (აკლია NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET).",
      ),
    );
  }

  const limit = file.type.startsWith("video/") ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  if (file.size > limit) {
    const actualMb = (file.size / (1024 * 1024)).toFixed(1);
    return Promise.reject(new Error(`${SIZE_LIMIT_MESSAGE} თქვენი ფაილი: ${actualMb} MB.`));
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({ secureUrl: data.secure_url, resourceType: data.resource_type });
        } catch {
          reject(new Error("Cloudinary-სგან მოვიდა მოულოდნელი პასუხი."));
        }
      } else {
        let message = `ატვირთვა ვერ მოხერხდა (${xhr.status}).`;
        try {
          const data = JSON.parse(xhr.responseText);
          if (data?.error?.message) message = data.error.message;
        } catch {
          // ignore parse failure, use default message
        }
        reject(new Error(message));
      }
    };

    xhr.onerror = () => reject(new Error("ქსელის შეცდომა ატვირთვისას."));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    xhr.send(formData);
  });
}

export interface BatchUploadItem {
  file: File;
  result?: CloudinaryUploadResult;
  error?: string;
}

// Uploads many files with a bounded number of concurrent XHRs (uploading
// e.g. 100 files all at once would blow past the browser's per-origin
// connection limits and make individual progress meaningless), reporting
// per-file progress as it goes via onFileProgress.
export async function uploadManyToCloudinary(
  files: File[],
  {
    concurrency = 4,
    onFileProgress,
  }: {
    concurrency?: number;
    onFileProgress?: (index: number, percent: number) => void;
  } = {},
): Promise<BatchUploadItem[]> {
  const results: BatchUploadItem[] = files.map((file) => ({ file }));
  let next = 0;

  async function worker() {
    while (next < files.length) {
      const index = next++;
      try {
        const result = await uploadToCloudinary(files[index], (percent) =>
          onFileProgress?.(index, percent),
        );
        results[index].result = result;
      } catch (err) {
        results[index].error = err instanceof Error ? err.message : "ატვირთვა ვერ მოხერხდა.";
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, files.length) }, () => worker());
  await Promise.all(workers);

  return results;
}
