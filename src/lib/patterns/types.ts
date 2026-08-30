import type { LocaleString } from "@/lib/content/types";

export type PatternDifficulty = "beginner" | "intermediate" | "advanced";

export interface Pattern {
  id: string;
  slug: string;
  title: LocaleString;
  description: LocaleString;
  category: string;
  sizeRange: string;
  difficulty: PatternDifficulty;
  coverImageUrl: string;
  galleryUrls: string[];
  pdfUrl: string;
  price: number;
  currency: "GEL" | "USD";
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatternPurchase {
  id: string;
  patternId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  purchasedAt: string;
  downloadCount: number;
  accessRevoked: boolean;
}
