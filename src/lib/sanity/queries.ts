import { client } from "./client";
import type {
  AboutPageData,
  HeroSectionData,
  PortfolioItemDetail,
  PortfolioItemSummary,
  SiteSettingsData,
  SkillData,
  WorkflowStepData,
} from "./types";
import type { CategoryRef } from "./types";

const localeStringProjection = "{ka, en}";
const localeTextProjection = "{ka, en}";

async function safeFetch<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  try {
    const result = await client.fetch<T>(query, params);
    return result ?? fallback;
  } catch {
    return fallback;
  }
}

export function getHeroSection() {
  return safeFetch<HeroSectionData | null>(
    `*[_type == "heroSection"][0]{
      headline ${localeStringProjection},
      subheadline ${localeTextProjection},
      mediaType,
      video{asset->{url, extension}},
      image,
      posterImage
    }`,
    {},
    null,
  );
}

export function getFeaturedPortfolioItems(limit = 3) {
  return safeFetch<PortfolioItemSummary[]>(
    `*[_type == "portfolioItem" && featured == true] | order(order asc) [0...$limit]{
      _id,
      title ${localeStringProjection},
      "slug": slug.current,
      category->{title ${localeStringProjection}, "slug": slug.current},
      coverImage,
      year
    }`,
    { limit },
    [],
  );
}

export function getPortfolioItems(categorySlug?: string) {
  const filter = categorySlug
    ? `_type == "portfolioItem" && category->slug.current == $categorySlug`
    : `_type == "portfolioItem"`;

  return safeFetch<PortfolioItemSummary[]>(
    `*[${filter}] | order(order asc){
      _id,
      title ${localeStringProjection},
      "slug": slug.current,
      category->{title ${localeStringProjection}, "slug": slug.current},
      coverImage,
      year
    }`,
    { categorySlug: categorySlug ?? null },
    [],
  );
}

export function getPortfolioItemBySlug(slug: string) {
  return safeFetch<PortfolioItemDetail | null>(
    `*[_type == "portfolioItem" && slug.current == $slug][0]{
      _id,
      title ${localeStringProjection},
      "slug": slug.current,
      category->{title ${localeStringProjection}, "slug": slug.current},
      description ${localeTextProjection},
      coverImage,
      gallery,
      video{asset->{url, extension}},
      year,
      occasion ${localeStringProjection}
    }`,
    { slug },
    null,
  );
}

export function getCategories() {
  return safeFetch<CategoryRef[]>(
    `*[_type == "category"] | order(order asc){
      _id,
      title ${localeStringProjection},
      "slug": slug.current
    }`,
    {},
    [],
  );
}

export function getSkills() {
  return safeFetch<SkillData[]>(
    `*[_type == "skill"] | order(order asc){
      _id,
      label ${localeStringProjection}
    }`,
    {},
    [],
  );
}

export function getWorkflowSteps() {
  return safeFetch<WorkflowStepData[]>(
    `*[_type == "workflowStep"] | order(order asc){
      _id,
      title ${localeStringProjection},
      description ${localeTextProjection}
    }`,
    {},
    [],
  );
}

export function getAboutPage() {
  return safeFetch<AboutPageData | null>(
    `*[_type == "aboutPage"][0]{
      portrait,
      bio ${localeTextProjection},
      careerNarrative ${localeTextProjection},
      achievementsNarrative ${localeTextProjection},
      programs
    }`,
    {},
    null,
  );
}

export function getSiteSettings() {
  return safeFetch<SiteSettingsData | null>(
    `*[_type == "siteSettings"][0]{
      siteName,
      tagline ${localeStringProjection},
      phone,
      email,
      socialLinks
    }`,
    {},
    null,
  );
}
