"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "mania_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("cookieConsent");

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (private mode, blocked site data) — skip
      // the banner rather than risk erroring on every page load.
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // Ignore — the banner just won't remember next visit.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <p className="text-sm text-text-muted">
          {t("message")}{" "}
          <Link href="/terms" className="text-gold underline underline-offset-2 hover:text-text-primary">
            {t("learnMore")}
          </Link>
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 bg-gold px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-text-primary cursor-pointer"
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
