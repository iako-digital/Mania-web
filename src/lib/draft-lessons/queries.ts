import { readContent, writeContent } from "@/lib/content/store";
import type { DraftLesson } from "./types";

const FILE = "draft-lessons.json";

export async function getDraftLessons(): Promise<DraftLesson[]> {
  return readContent<DraftLesson[]>(FILE);
}

export async function getPendingDraftLessons(): Promise<DraftLesson[]> {
  const drafts = await getDraftLessons();
  return drafts.filter((d) => d.status === "draft").sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getDraftLesson(id: string): Promise<DraftLesson | null> {
  const drafts = await getDraftLessons();
  return drafts.find((d) => d.id === id) ?? null;
}

export async function addDraftLesson(draft: DraftLesson): Promise<void> {
  const drafts = await getDraftLessons();
  drafts.push(draft);
  await writeContent(FILE, drafts);
}

export async function updateDraftLesson(id: string, patch: Partial<DraftLesson>): Promise<void> {
  const drafts = await getDraftLessons();
  const draft = drafts.find((d) => d.id === id);
  if (draft) Object.assign(draft, patch);
  await writeContent(FILE, drafts);
}

export async function removeDraftLesson(id: string): Promise<void> {
  const drafts = await getDraftLessons();
  await writeContent(
    FILE,
    drafts.filter((d) => d.id !== id),
  );
}
