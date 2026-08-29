import { readContent } from "./store";
import type {
  AboutContent,
  AiAssistantContent,
  CategoryItem,
  HeroContent,
  PortfolioItemContent,
  SiteSettings,
  SkillItem,
  WorkflowStepItem,
} from "./types";

export interface PortfolioItemWithCategory extends PortfolioItemContent {
  category?: CategoryItem;
}

function byOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

async function attachCategories(items: PortfolioItemContent[]): Promise<PortfolioItemWithCategory[]> {
  const categories = await getCategories();
  const bySlug = new Map(categories.map((category) => [category.slug, category]));
  return items.map((item) => ({ ...item, category: bySlug.get(item.categorySlug) }));
}

export async function getHeroContent(): Promise<HeroContent> {
  return readContent<HeroContent>("hero.json");
}

export async function getAboutContent(): Promise<AboutContent> {
  return readContent<AboutContent>("about.json");
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return readContent<SiteSettings>("site.json");
}

export async function getAiAssistantContent(): Promise<AiAssistantContent> {
  return readContent<AiAssistantContent>("ai-assistant.json");
}

export async function getSkills(): Promise<SkillItem[]> {
  const skills = await readContent<SkillItem[]>("skills.json");
  return byOrder(skills);
}

export async function getWorkflowSteps(): Promise<WorkflowStepItem[]> {
  const steps = await readContent<WorkflowStepItem[]>("workflow.json");
  return byOrder(steps);
}

export async function getCategories(): Promise<CategoryItem[]> {
  const categories = await readContent<CategoryItem[]>("categories.json");
  return byOrder(categories);
}

export async function getPortfolioItems(categorySlug?: string): Promise<PortfolioItemWithCategory[]> {
  const items = await readContent<PortfolioItemContent[]>("portfolio.json");
  const filtered = categorySlug ? items.filter((item) => item.categorySlug === categorySlug) : items;
  return attachCategories(byOrder(filtered));
}

export async function getFeaturedPortfolioItems(limit = 3): Promise<PortfolioItemWithCategory[]> {
  const items = await readContent<PortfolioItemContent[]>("portfolio.json");
  return attachCategories(byOrder(items.filter((item) => item.featured)).slice(0, limit));
}

export async function getPortfolioItemBySlug(slug: string): Promise<PortfolioItemWithCategory | null> {
  const items = await readContent<PortfolioItemContent[]>("portfolio.json");
  const item = items.find((entry) => entry.slug === slug);
  if (!item) return null;
  const [withCategory] = await attachCategories([item]);
  return withCategory;
}
