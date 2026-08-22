"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "./MobileNav";

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/expertise", key: "expertise" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="font-display text-lg tracking-tight">
          MANIA <span className="text-gold">VASHAKIDZE</span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
                  active ? "text-gold" : "text-text-muted hover:text-text-primary"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-mono text-xs uppercase tracking-widest lg:hidden cursor-pointer"
          aria-label={t("menu")}
        >
          {t("menu")}
        </button>
      </div>

      <MobileNav open={open} onClose={() => setOpen(false)} items={NAV_ITEMS} activePathname={pathname} />
    </header>
  );
}
