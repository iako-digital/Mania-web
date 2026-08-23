export function YouTubeEmbed({ videoId, title, className = "" }: { videoId: string; title: string; className?: string }) {
  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-surface ${className}`}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
        style={{ border: 0 }}
      />
    </div>
  );
}
