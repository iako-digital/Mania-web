import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfoCard } from "@/components/contact/ContactInfoCard";
import { getSiteSettings } from "@/lib/sanity/queries";

const FALLBACK_PHONE = "+995 551 87 28 88";
const FALLBACK_EMAIL = "Vashakidzemania@gmail.com";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contact" });
  const settings = await getSiteSettings();

  const phone = settings?.phone || FALLBACK_PHONE;
  const email = settings?.email || FALLBACK_EMAIL;

  return (
    <div className="mx-auto max-w-5xl px-6 py-24 lg:px-10 lg:py-32">
      <SectionHeading kicker="Contact" title={t("title")} subtitle={t("subtitle")} />

      <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_minmax(0,340px)]">
        <ContactForm />
        <ContactInfoCard locale={locale} phone={phone} email={email} />
      </div>
    </div>
  );
}
