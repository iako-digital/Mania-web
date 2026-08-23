import { getTranslations } from "next-intl/server";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export async function ContactInfoCard({
  locale,
  phone,
  email,
  location,
}: {
  locale: string;
  phone: string;
  email: string;
  location?: string;
}) {
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <RevealOnScroll className="flex flex-col gap-8 border border-hairline bg-surface p-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">{t("phoneLabel")}</p>
        <a href={`tel:${phone.replace(/\s+/g, "")}`} className="mt-2 block font-display text-2xl text-text-primary hover:text-gold transition-colors">
          {phone}
        </a>
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">{t("emailLabel")}</p>
        <a href={`mailto:${email}`} className="mt-2 block font-display text-xl text-text-primary hover:text-gold transition-colors break-all">
          {email}
        </a>
      </div>
      {location && (
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">{t("locationLabel")}</p>
          <p className="mt-2 text-text-primary">{location}</p>
        </div>
      )}
    </RevealOnScroll>
  );
}
