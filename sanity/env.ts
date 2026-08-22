export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

// Until a real Sanity project is connected (see .env.example), pages
// fall back to the bundled default copy instead of throwing at build time.
export const isSanityConfigured = projectId.length > 0;
