"use client";

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
