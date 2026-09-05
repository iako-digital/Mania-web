export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || url.includes("/video/upload/");
}

// Cloudinary serves images unoptimized by default at whatever URL you ask
// for — f_auto/q_auto are on-the-fly delivery transformations (no re-upload
// needed), so inserting them here automatically converts to AVIF/WebP per
// browser and compresses heavily with no visible quality loss, for every
// Cloudinary image already stored in content just as much as new uploads.
// Only touches /image/upload/ delivery URLs — video and raw (PDF) uploads
// are untouched, and non-Cloudinary URLs pass through unchanged.
export function optimizeCloudinaryUrl(url: string | undefined | null): string {
  if (!url) return url ?? "";
  const marker = "/image/upload/";
  const index = url.indexOf(marker);
  if (index === -1) return url;

  const afterMarker = url.slice(index + marker.length);
  if (afterMarker.startsWith("f_auto")) return url; // already optimized

  return `${url.slice(0, index + marker.length)}f_auto,q_auto/${afterMarker}`;
}
