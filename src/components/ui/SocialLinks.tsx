const ICONS = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23 12s0-3.4-.43-5a3 3 0 0 0-2.12-2.12C18.8 4.4 12 4.4 12 4.4s-6.8 0-8.45.48A3 3 0 0 0 1.43 7C1 8.6 1 12 1 12s0 3.4.43 5a3 3 0 0 0 2.12 2.12C5.2 19.6 12 19.6 12 19.6s6.8 0 8.45-.48A3 3 0 0 0 22.57 17C23 15.4 23 12 23 12z" />
      <path d="M9.8 15.3V8.7l5.7 3.3z" fill="var(--color-ink, #0b0b0d)" />
    </svg>
  ),
} as const;

export type SocialPlatform = keyof typeof ICONS;

export function SocialLinks({
  facebookUrl,
  instagramUrl,
  youtubeUrl,
  className = "",
  iconClassName = "h-5 w-5",
}: {
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  className?: string;
  iconClassName?: string;
}) {
  const links: { platform: SocialPlatform; url: string; label: string }[] = [
    facebookUrl && { platform: "facebook", url: facebookUrl, label: "Facebook" },
    instagramUrl && { platform: "instagram", url: instagramUrl, label: "Instagram" },
    youtubeUrl && { platform: "youtube", url: youtubeUrl, label: "YouTube" },
  ].filter(Boolean) as { platform: SocialPlatform; url: string; label: string }[];

  if (links.length === 0) return null;

  return (
    <div className={className}>
      {links.map(({ platform, url, label }) => (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="text-text-muted transition-colors hover:text-gold"
        >
          <span className={iconClassName}>{ICONS[platform]}</span>
        </a>
      ))}
    </div>
  );
}
