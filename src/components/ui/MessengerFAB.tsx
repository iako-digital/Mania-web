"use client";

import { useTranslations } from "next-intl";

export function MessengerFAB({ href }: { href?: string }) {
  const t = useTranslations("messenger");

  if (!href) return null;

  return (
    <div className="group fixed bottom-6 right-6 z-50">
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-1/2 right-full mr-3 translate-y-1/2 whitespace-nowrap bg-surface px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-text-primary opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 border border-hairline"
      >
        {t("tooltip")}
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("tooltip")}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-transform duration-200 hover:scale-105"
        style={{ background: "linear-gradient(135deg, #00B2FF 0%, #006AFF 50%, #A033FF 100%)" }}
      >
        {/* Messenger-style chat bubble + lightning glyph, inline so the FAB
            has no external asset dependency. */}
        <svg viewBox="0 0 36 36" width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 0C7.9 0 0 7.4 0 17.4c0 5.6 2.6 10.6 6.7 13.9V36l6.1-3.4c1.6.4 3.4.7 5.2.7 10.1 0 18-7.4 18-17.4S28.1 0 18 0z"
            fill="white"
          />
          <path
            d="M8.4 22.1l6.6-7 5.3 4.3 5.9-6.6-6.7 7-5.3-4.3-5.8 6.6z"
            fill="#0084FF"
          />
        </svg>
      </a>
    </div>
  );
}
