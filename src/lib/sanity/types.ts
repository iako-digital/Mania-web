import type { Image } from "sanity";

export interface LocaleString {
  ka?: string;
  en?: string;
}

export interface SanityFile {
  asset?: {
    url: string;
    extension: string;
  };
}

export interface CategoryRef {
  _id?: string;
  title: LocaleString;
  slug: string;
}

export interface HeroSectionData {
  headline: LocaleString;
  subheadline?: LocaleString;
  mediaType: "video" | "image";
  video?: SanityFile;
  image?: Image;
  posterImage?: Image;
}

export interface PortfolioItemSummary {
  _id: string;
  title: LocaleString;
  slug: string;
  category?: CategoryRef;
  coverImage: Image;
  year?: string;
}

export interface PortfolioItemDetail extends PortfolioItemSummary {
  description?: LocaleString;
  gallery?: Image[];
  video?: SanityFile;
  occasion?: LocaleString;
}

export interface SkillData {
  _id: string;
  label: LocaleString;
}

export interface WorkflowStepData {
  _id: string;
  title: LocaleString;
  description?: LocaleString;
}

export interface AboutPageData {
  portrait?: Image;
  bio?: LocaleString;
  careerNarrative?: LocaleString;
  achievementsNarrative?: LocaleString;
  programs?: string[];
}

export interface SiteSettingsData {
  siteName?: string;
  tagline?: LocaleString;
  phone?: string;
  email?: string;
  socialLinks?: { label: string; url: string }[];
}
