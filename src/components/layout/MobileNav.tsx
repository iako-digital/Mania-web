"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type NavItem = { href: string; key: string };

export function MobileNav({
  open,
  onClose,
  items,
  activePathname,
}: {
  open: boolean;
  onClose: () => void;
  items: readonly NavItem[];
  activePathname: string;
}) {
  const t = useTranslations("nav");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex flex-col bg-ink lg:hidden"
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

          <div className="flex items-center justify-between px-6 py-8">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
