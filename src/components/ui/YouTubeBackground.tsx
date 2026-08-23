const PARAMS =
  "autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&fs=0&showinfo=0";

// Fills its (relatively/absolutely positioned) parent edge-to-edge like a
// muted, looping <video> background, regardless of the parent's aspect
// ratio — the oversized-iframe-centered-and-cropped trick.
export function YouTubeBackground({ videoId, className = "" }: { videoId: string; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${PARAMS}&playlist=${videoId}`}
        title=""
        tabIndex={-1}
        allow="autoplay; encrypted-media"
        className="absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
        style={{ border: 0 }}
      />
    </div>
  );
}
