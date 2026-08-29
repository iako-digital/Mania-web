"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SocialLinks } from "@/components/ui/SocialLinks";

type NavItem = { href: string; key: string };

export function MobileNav({
  open,
  onClose,
  items,
  activePathname,
  facebookUrl,
  instagramUrl,
  youtubeUrl,
}: {
  open: boolean;
  onClose: () => void;
  items: readonly NavItem[];
  activePathname: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}) {
  const t = useTranslations("nav");

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col bg-ink lg:hidden"
        >
          <div className="flex items-center justify-between px-6 py-5">
            <span className="font-display text-lg">
              MANIA <span className="text-gold">VASHAKIDZE</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-xs uppercase tracking-widest cursor-pointer"
            >
              {t("close")}
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-2 px-6">
            {items.map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`block py-3 font-display text-3xl ${
                    activePathname === item.href ? "text-gold" : "text-text-primary"
                  }`}
                >
                  {t(item.key)}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-6 px-6 py-8">
            <SocialLinks
              facebookUrl={facebookUrl}
              instagramUrl={instagramUrl}
              youtubeUrl={youtubeUrl}
              className="flex items-center gap-6"
              iconClassName="h-6 w-6"
            />
            <ThemeToggle />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
