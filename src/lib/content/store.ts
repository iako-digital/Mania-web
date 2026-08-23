import { promises as fs } from "fs";
import path from "path";
import { commitFileToGitHub } from "./github";

const CONTENT_DIR = path.join(process.cwd(), "content");

export async function readContent<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf-8");
  return JSON.parse(raw) as T;
}

// Writes go straight to disk locally (instant, works great for `npm run dev`
// or any host with a persistent filesystem). In production without a
// writable filesystem (e.g. Vercel), set GITHUB_TOKEN + GITHUB_REPO so the
// same write commits the file to the repo instead, which redeploys the site
// with the change a short while later.
export async function writeContent<T>(file: string, data: T): Promise<void> {
  const json = JSON.stringify(data, null, 2) + "\n";

  if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
    await commitFileToGitHub(`content/${file}`, json, `content: update ${file} via admin panel`);
    return;
  }

  await fs.writeFile(path.join(CONTENT_DIR, file), json, "utf-8");
}
