"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const t = useTranslations("theme");
  const [isLight, setIsLight] = useState(
    () => typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "light",
  );

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", next ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("toggle")}
      suppressHydrationWarning
      className="font-mono text-xs uppercase tracking-widest text-text-muted hover:text-gold transition-colors cursor-pointer"
    >
      {isLight ? t("light") : t("dark")}
    </button>
  );
}
