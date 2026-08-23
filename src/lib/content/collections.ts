import { readContent, writeContent } from "./store";

export async function upsertItem<T extends { id: string }>(file: string, item: T): Promise<void> {
  const items = await readContent<T[]>(file);
  const index = items.findIndex((existing) => existing.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }
  await writeContent(file, items);
}

export async function deleteItem(file: string, id: string): Promise<void> {
  const items = await readContent<{ id: string }[]>(file);
  await writeContent(
    file,
    items.filter((item) => item.id !== id),
  );
}
