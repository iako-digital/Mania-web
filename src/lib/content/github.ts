const API = "https://api.github.com";

// Commits a single file's contents to the configured GitHub repo via the
// Contents API. Used as the production write path for /admin, since a
// Vercel serverless deployment can't persist local filesystem writes across
// requests — committing to git triggers a fresh deploy with the change.
export async function commitFileToGitHub(filePath: string, content: string, message: string) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) {
    throw new Error("GITHUB_TOKEN and GITHUB_REPO must be set to save content in production.");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const getRes = await fetch(
    `${API}/repos/${repo}/contents/${filePath}?ref=${branch}`,
    { headers, cache: "no-store" },
  );

  let sha: string | undefined;
  if (getRes.ok) {
    const data = (await getRes.json()) as { sha: string };
    sha = data.sha;
  } else if (getRes.status !== 404) {
    throw new Error(`GitHub read failed (${getRes.status}): ${await getRes.text()}`);
  }

  const putRes = await fetch(`${API}/repos/${repo}/contents/${filePath}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch,
      sha,
    }),
  });

  if (!putRes.ok) {
    throw new Error(`GitHub write failed (${putRes.status}): ${await putRes.text()}`);
  }
}
