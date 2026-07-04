# Wiki

[![CI](https://github.com/arongordos/wiki/actions/workflows/ci.yml/badge.svg)](https://github.com/arongordos/wiki/actions/workflows/ci.yml)

A wiki/blog app for writing, publishing, and reading articles, with AI-generated summaries.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19
- [Drizzle ORM](https://orm.drizzle.team) on [Neon](https://neon.tech) Postgres
- [Better Auth](https://better-auth.com) (email/password + GitHub OAuth)
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) for image uploads
- [Vercel AI SDK](https://ai-sdk.dev) for article summarization
- shadcn/ui, Tailwind CSS
- [Biome](https://biomejs.dev) for linting/formatting

## Getting Started

1. Copy `.env.example` to `.env` and fill in the values (Neon `DATABASE_URL`, Better Auth secret/URL, GitHub OAuth client ID/secret, Vercel Blob token, AI gateway key).
2. Install dependencies, push the schema, and seed the database:

   ```bash
   npm install
   npm run db:push
   npm run db:seed
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Scripts

```bash
npm run dev          # start dev server
npm run build        # production build
npm run start        # run production build
npm run lint         # biome check
npm run format       # biome format --write
npm run typecheck    # tsc --noEmit
npm run db:generate  # generate a drizzle migration from schema changes
npm run db:migrate   # apply drizzle migrations
npm run db:push      # push schema directly to the db (no migration file)
npm run db:seed      # seed the database
```