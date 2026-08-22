import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-hairline">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-xl">
              MANIA <span className="text-gold">VASHAKIDZE</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-text-muted">{t("tagline")}</p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {(["home", "portfolio", "expertise", "about", "contact"] as const).map((key) => (
              <Link
                key={key}
                href={key === "home" ? "/" : `/${key}`}
                className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted hover:text-gold transition-colors"
              >
                {nav(key)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-hairline pt-6 text-xs text-text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Mania Vashakidze. {t("rights")}
          </p>
          <p className="font-mono uppercase tracking-widest">Gerber AccuMark Certified</p>
        </div>
      </div>
    </footer>
  );
}
