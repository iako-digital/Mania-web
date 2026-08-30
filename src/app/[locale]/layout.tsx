import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono, Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeScript } from "@/components/ui/ThemeScript";
import { MessengerFAB } from "@/components/ui/MessengerFAB";
import { AiChatWidget } from "@/components/ui/AiChatWidget";
import { getAiAssistantContent, getSiteSettings } from "@/lib/content/queries";
import { pickLocale } from "@/lib/content/locale";
import "../globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// Fraunces/Inter/JetBrains Mono have no Georgian (Mkhedruli) glyphs, so these
// carry the Georgian script — listed after the Latin fonts in each CSS
// font-family stack (see globals.css), the browser uses them only for the
// glyphs the Latin face is missing.
const notoSerifGeorgian = Noto_Serif_Georgian({
  variable: "--font-noto-serif-georgian",
  subsets: ["georgian"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-sans-georgian",
  subsets: ["georgian"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SITE_TITLE = "Mania Vashakidze — Pattern-Making & Technical Apparel Designer";
const SITE_DESCRIPTION: Record<Locale, string> = {
  ka: "Mania Vashakidze-ს პორტფოლიო — ტანსაცმლის კონსტრუირება, თარგების დამუშავება და ტექნიკური დიზაინი.",
  en: "Portfolio of Mania Vashakidze — Pattern-Making, Apparel Construction, and Technical Design.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description = pickLocale(SITE_DESCRIPTION, locale as Locale);

  return {
    metadataBase: new URL("https://mania.com.ge"),
    title: {
      default: SITE_TITLE,
      template: "%s — Mania Vashakidze",
    },
    description,
    other: {
      title: SITE_TITLE,
    },
    openGraph: {
      type: "website",
      url: "https://mania.com.ge/",
      title: SITE_TITLE,
      description,
      images: "/og-image.jpg",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description,
      images: "/og-image.jpg",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [settings, aiAssistant] = await Promise.all([getSiteSettings(), getAiAssistantContent()]);

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} ${notoSerifGeorgian.variable} ${notoSansGeorgian.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-ink text-text-primary">
        <ThemeScript />
        <NextIntlClientProvider>
          <div className="blueprint-grid" aria-hidden="true" />
          <Header
            facebookUrl={settings.facebookUrl}
            instagramUrl={settings.instagramUrl}
            youtubeUrl={settings.youtubeUrl}
          />
          <main className="relative z-10 flex-1">{children}</main>
          <Footer />
          <MessengerFAB href={settings.messengerUrl} />
          {aiAssistant.enabled && (
            <AiChatWidget welcomeMessage={pickLocale(aiAssistant.welcomeMessage, locale)} />
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
