import crypto from "crypto";

const BUNNY_API_BASE = "https://video.bunnycdn.com/library";

export interface BunnyUploadCredentials {
  videoId: string;
  libraryId: string;
  expiration: number;
  signature: string;
  tusEndpoint: string;
}

function getConfig() {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const apiKey = process.env.BUNNY_STREAM_API_KEY;
  if (!libraryId || !apiKey) return null;
  return { libraryId, apiKey };
}

// Creates a video entry in the Bunny Stream library, then derives the
// resumable-upload (TUS) signature for it. Bunny's signature is
// sha256(libraryId + apiKey + expiration + videoId) — this lets the browser
// upload the file directly to Bunny over TUS without ever seeing the
// private API key. See: https://docs.bunny.net/reference/tus-uploading
export async function createSignedBunnyUpload(title: string): Promise<BunnyUploadCredentials> {
  const config = getConfig();
  if (!config) {
    throw new Error("BUNNY_STREAM_LIBRARY_ID / BUNNY_STREAM_API_KEY is not configured.");
  }
  const { libraryId, apiKey } = config;

  const createRes = await fetch(`${BUNNY_API_BASE}/${libraryId}/videos`, {
    method: "POST",
    headers: {
      AccessKey: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    throw new Error(`Bunny Stream video creation failed (${createRes.status}): ${await createRes.text()}`);
  }

  const created = (await createRes.json()) as { guid: string };
  const expiration = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
  const signature = crypto
    .createHash("sha256")
    .update(`${libraryId}${apiKey}${expiration}${created.guid}`)
    .digest("hex");

  return {
    videoId: created.guid,
    libraryId,
    expiration,
    signature,
    tusEndpoint: "https://video.bunnycdn.com/tusupload",
  };
}

export function getBunnyPlaybackUrl(videoId: string): string {
  const cdnHostname = process.env.BUNNY_STREAM_CDN_HOSTNAME;
  if (!cdnHostname || !videoId) return "";
  return `https://${cdnHostname}/${videoId}/playlist.m3u8`;
}

export function getBunnyEmbedUrl(videoId: string): string {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  if (!libraryId || !videoId) return "";
  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
}
