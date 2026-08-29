export interface LocaleString {
  ka: string;
  en: string;
}

export interface HeroContent {
  headline: LocaleString;
  subheadline: LocaleString;
  videoUrl?: string;
  imageUrl?: string;
  posterUrl?: string;
}

export interface AboutContent {
  portraitUrl?: string;
  bio: LocaleString;
  careerNarrative: LocaleString;
  achievementsNarrative: LocaleString;
  programs: string[];
}

export interface SkillItem {
  id: string;
  order: number;
  label: LocaleString;
}

export interface WorkflowStepItem {
  id: string;
  order: number;
  title: LocaleString;
  description: LocaleString;
}

export interface CategoryItem {
  id: string;
  slug: string;
  order: number;
  title: LocaleString;
}

export interface PortfolioItemContent {
  id: string;
  slug: string;
  title: LocaleString;
  categorySlug: string;
  description: LocaleString;
  coverImageUrl: string;
  galleryUrls: string[];
  videoUrl?: string;
  featured: boolean;
  order: number;
  year?: string;
  occasion?: LocaleString;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface AiAssistantContent {
  enabled: boolean;
  knowledgeBase: string;
  systemInstructions: string;
  welcomeMessage: LocaleString;
}

export interface SiteSettings {
  siteName: string;
  tagline: LocaleString;
  phone: string;
  email: string;
  location: string;
  messengerUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  socialLinks: SocialLink[];
}
