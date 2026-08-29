import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfoCard } from "@/components/contact/ContactInfoCard";
import { getSiteSettings } from "@/lib/content/queries";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contact" });
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-5xl px-6 py-24 lg:px-10 lg:py-32">
      <SectionHeading kicker="Contact" title={t("title")} subtitle={t("subtitle")} />

      <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_minmax(0,340px)]">
        <ContactForm />
        <ContactInfoCard
          locale={locale}
          phone={settings.phone}
          email={settings.email}
          location={settings.location}
          messengerUrl={settings.messengerUrl}
          facebookUrl={settings.facebookUrl}
          instagramUrl={settings.instagramUrl}
          youtubeUrl={settings.youtubeUrl}
        />
      </div>
    </div>
  );
}
