import { defineConfig, env } from "prisma/config";

// Prisma 7 config for CLI use only (validate/generate/future migrate) — the
// app itself does not read this file or DATABASE_URL at runtime; it still
// runs entirely on content/*.json (see prisma/schema.prisma's header
// comment for the intended future cutover).
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
