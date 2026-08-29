import { promises as fs } from "fs";
import path from "path";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { commitFileToGitHub } from "./github";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Once deployed, a Vercel serverless instance's local content/*.json files
// are frozen at whatever they were when that deployment was built — writes
// from the admin panel commit straight to GitHub instead (see writeContent
// below) and only reach local disk on the *next* deployment. Reading from
// GitHub at runtime, instead of the frozen local copy, is what makes a save
// show up immediately instead of only after the next deploy finishes.
// During the build itself (prerendering), the local checkout already has
// the latest commit, so read straight from disk there — no need to pay for
// a network round trip, and the build shouldn't depend on GitHub being up.
function usesGitHubStore(): boolean {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) return false;
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}

async function readContentFromGitHub<T>(file: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  const res = await fetch(`https://api.github.com/repos/${repo}/contents/content/${file}?ref=${branch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.raw+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GitHub content read failed (${res.status}) for content/${file}: ${await res.text()}`);
  }

  return (await res.json()) as T;
}

export async function readContent<T>(file: string): Promise<T> {
  if (usesGitHubStore()) {
    return readContentFromGitHub<T>(file);
  }

  const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf-8");
  return JSON.parse(raw) as T;
}

// Writes go straight to disk locally (instant, works great for `npm run dev`
// or any host with a persistent filesystem). In production without a
// writable filesystem (e.g. Vercel), set GITHUB_TOKEN + GITHUB_REPO so the
// same write commits the file to the repo instead, which redeploys the site
// with the change a short while later (readContent above reads the commit
// straight back from GitHub in the meantime, so the change is visible well
// before that redeploy finishes).
export async function writeContent<T>(file: string, data: T): Promise<void> {
  const json = JSON.stringify(data, null, 2) + "\n";

  if (usesGitHubStore()) {
    await commitFileToGitHub(`content/${file}`, json, `content: update ${file} via admin panel`);
    return;
  }

  await fs.writeFile(path.join(CONTENT_DIR, file), json, "utf-8");
}
