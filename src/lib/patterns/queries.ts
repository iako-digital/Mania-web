import { randomUUID } from "crypto";
import { readContent, writeContent } from "@/lib/content/store";
import type { Pattern, PatternPurchase } from "./types";

const PATTERNS_FILE = "patterns.json";
const PURCHASES_FILE = "pattern-purchases.json";

function byRecency<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPatterns(): Promise<Pattern[]> {
  return readContent<Pattern[]>(PATTERNS_FILE);
}

export async function getPublishedPatterns(category?: string): Promise<Pattern[]> {
  const patterns = await getPatterns();
  const published = patterns.filter((p) => p.published);
  const filtered = category ? published.filter((p) => p.category === category) : published;
  return byRecency(filtered);
}

export async function getPatternById(id: string): Promise<Pattern | null> {
  const patterns = await getPatterns();
  return patterns.find((p) => p.id === id) ?? null;
}

export async function getPatternBySlug(slug: string): Promise<Pattern | null> {
  const patterns = await getPatterns();
  return patterns.find((p) => p.slug === slug) ?? null;
}

export async function getPatternCategories(): Promise<string[]> {
  const patterns = await getPatterns();
  return [...new Set(patterns.filter((p) => p.published).map((p) => p.category))].sort();
}

export async function getPatternPurchases(): Promise<PatternPurchase[]> {
  return readContent<PatternPurchase[]>(PURCHASES_FILE);
}

export async function getPatternPurchase(patternId: string, studentId: string): Promise<PatternPurchase | null> {
  const purchases = await getPatternPurchases();
  return purchases.find((p) => p.patternId === patternId && p.studentId === studentId) ?? null;
}

export async function getStudentPatternPurchases(studentId: string): Promise<PatternPurchase[]> {
  const purchases = await getPatternPurchases();
  return purchases.filter((p) => p.studentId === studentId);
}

export async function savePatternPurchases(purchases: PatternPurchase[]): Promise<void> {
  await writeContent(PURCHASES_FILE, purchases);
}

export async function grantPatternAccess(
  patternId: string,
  studentId: string,
  studentName: string,
  studentEmail: string,
): Promise<void> {
  const purchases = await getPatternPurchases();
  const now = new Date().toISOString();
  const existing = purchases.find((p) => p.patternId === patternId && p.studentId === studentId);

  if (existing) {
    existing.accessRevoked = false;
  } else {
    purchases.push({
      id: randomUUID(),
      patternId,
      studentId,
      studentName,
      studentEmail,
      purchasedAt: now,
      downloadCount: 0,
      accessRevoked: false,
    });
  }

  await savePatternPurchases(purchases);
}
