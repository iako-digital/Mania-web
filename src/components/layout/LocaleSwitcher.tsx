"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={`flex items-center gap-1 font-mono text-xs uppercase tracking-widest ${className}`}>
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: loc })}
            className={`cursor-pointer transition-colors ${
              loc === locale ? "text-gold" : "text-text-muted hover:text-text-primary"
            }`}
            aria-current={loc === locale}
          >
            {loc}
          </button>
          {i < routing.locales.length - 1 && <span className="text-hairline">/</span>}
        </span>
      ))}
    </div>
  );
}
