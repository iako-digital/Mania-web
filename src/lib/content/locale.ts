import type { LocaleString } from "./types";

export function pickLocale(value: LocaleString | undefined | null, locale: string): string {
  if (!value) return "";
  const primary = locale === "en" ? value.en : value.ka;
  return primary || value.en || value.ka || "";
}
