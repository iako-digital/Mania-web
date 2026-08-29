import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/content/queries";
import { SocialLinks } from "@/components/ui/SocialLinks";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const contact = await getTranslations("contact");
  const messenger = await getTranslations("messenger");
  const settings = await getSiteSettings();
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

          <div className="flex flex-col gap-2 text-sm">
            {settings.phone && (
              <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="text-text-muted hover:text-gold transition-colors">
                {contact("phoneLabel")}: {settings.phone}
              </a>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="text-text-muted hover:text-gold transition-colors">
                {contact("emailLabel")}: {settings.email}
              </a>
            )}
            {settings.messengerUrl && (
              <a
                href={settings.messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-gold transition-colors"
              >
                {messenger("contactLabel")}
              </a>
            )}
            {settings.location && <p className="text-text-muted">{settings.location}</p>}
            <SocialLinks
              facebookUrl={settings.facebookUrl}
              instagramUrl={settings.instagramUrl}
              youtubeUrl={settings.youtubeUrl}
              className="mt-1 flex items-center gap-4"
            />
            {settings.socialLinks.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
                {settings.socialLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs uppercase tracking-[0.15em] text-text-muted hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-hairline pt-6 text-xs text-text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Mania Vashakidze. {t("rights")}
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono uppercase tracking-widest">Gerber AccuMark Certified</span>
            <span className="text-text-muted/40">·</span>
            <span>
              Powered by{" "}
              <a
                href="https://www.cdc.org.ge/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                CDC Studio
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
