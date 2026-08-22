# Mania Vashakidze — Portfolio

Bilingual (Georgian/English) VIP portfolio site for pattern-maker & designer Mania Vashakidze, built with Next.js (App Router), Tailwind CSS, Framer Motion, next-intl, and Sanity.io as the content backend.

## Stack

- **Frontend:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Framer Motion
- **i18n:** next-intl — `/ka` (Georgian, default) and `/en` routes
- **CMS / Admin:** Sanity Studio, embedded at `/studio`
- **Contact form:** `/api/contact` route → saves a `Message` document in Sanity, optionally emails via Resend

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Sanity project details
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site renders with built-in bilingual fallback copy even before any content exists in Sanity — `/studio` requires a real `NEXT_PUBLIC_SANITY_PROJECT_ID` to load.

## Environment variables

See [`.env.example`](.env.example) for the full list (Sanity project ID/dataset/token, optional Resend keys).

## Project structure

- `src/app/[locale]/` — public site pages (locale-prefixed)
- `src/app/studio/` — embedded Sanity Studio
- `src/components/` — UI, organized by page/section
- `src/lib/sanity/` — Sanity client, GROQ queries, types
- `src/messages/` — `ka.json` / `en.json` structural UI strings
- `sanity/schemaTypes/` — content model (documents + localized object types)
- `sanity/structure.ts` — custom Studio desk structure

## Deploy

Deployed on Vercel, connected to Sanity for content. See project notes for the full deployment checklist.
