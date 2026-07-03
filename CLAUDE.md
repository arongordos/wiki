# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## ⚠️ Non-standard Next.js version

This project runs **Next.js 16.2.10**. One concrete breaking change to know before touching routing: **Middleware is now called Proxy** (`proxy.ts` at the project root, exporting `proxy`/default, same behavior as old middleware) — this project currently has no proxy file. If you add config-driven routing/auth interception, use the Proxy convention, not `middleware.ts`.

## Commands

```bash
npm run dev          # start dev server (localhost:3000)
npm run build         # production build
npm run start         # run production build
npm run lint          # biome check (lint)
npm run format        # biome format --write
npm run db:generate    # generate a drizzle migration from schema.ts changes
npm run db:migrate    # apply drizzle migrations
npm run db:push       # push schema directly to db (no migration file)
npm run db:seed       # run src/db/seed.ts
```

There is no test suite configured in this repo. Biome (`biome.json`) handles both linting and formatting — there is no separate ESLint/Prettier config.

## Environment

Copy `.env.example` to `.env`. Required vars: `DATABASE_URL` (Neon Postgres), `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_BETTER_AUTH_URL`, `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` (GitHub OAuth), `BLOB_BASE_URL`/`BLOB_READ_WRITE_TOKEN` (Vercel Blob), `AI_GATEWAY_API_KEY` (AI summarization).

## Architecture

This is a wiki/blog app: Next.js App Router + Drizzle ORM (Neon Postgres) + Better Auth + Vercel Blob + Vercel AI SDK.

**Route groups** under `src/app/`:
- `(auth)` — sign-in/sign-up pages, no shared nav chrome.
- `(root)` — the main app, wrapped in `NavBar`; contains `/`, `/wiki/[id]` (view), `/wiki/new`, `/wiki/edit/[id]`.
- `api/auth/[...all]` — Better Auth's catch-all route handler (all auth HTTP endpoints funnel through here).

**Data flow**: pages are server components that call read helpers directly (`src/lib/data/articles.ts` — `getArticles`, `getArticleById`, both querying Drizzle and left-joining `user` for author name). Writes go through Server Actions (`"use server"` files in `src/app/actions/`):
- `articles.ts` — `createArticle`/`updateArticle`/`deleteArticle`. Every mutation calls `requireUser()` (throws if no Better Auth session), and update/delete additionally check `isArticleAuthor` (`src/db/authz.ts`) — ownership is enforced in the action, not at the DB layer.
- `upload.ts` — `uploadFile`/`deleteFile` for article images via `@vercel/blob`, with server-side MIME/size validation (10MB max, jpeg/png/webp only).

**Auth**: `src/lib/auth.ts` configures Better Auth (Drizzle adapter, email/password + GitHub OAuth) and is imported server-side wherever a session is needed (`auth.api.getSession({ headers: await headers() })`). `src/lib/auth-client.ts` is the client-side counterpart. Auth tables (`user`, `session`, `account`, `verification`) live in `src/db/auth-schema.ts`, re-exported from `src/db/schema.ts` alongside the app's own `articles` table.

**Schema/migrations**: Drizzle schema is hand-written in `src/db/schema.ts` (app tables) and `src/db/auth-schema.ts` (auth tables, generated/maintained for Better Auth). `drizzle.config.ts` points at `./src/db/schema.ts` and outputs migrations to `./drizzle`. After editing schema files, run `db:generate` then `db:migrate` (or `db:push` for quick local iteration without a migration file).

**AI summarization**: `src/ai/summarize.ts` uses the Vercel AI SDK (`generateText`) to produce a 1-2 sentence summary, called from both `createArticle` and `updateArticle` — every article write regenerates `articles.summary` server-side.

**UI**: shadcn/ui components in `src/components/ui` (style: `radix-vega`, baseColor `neutral`, icon library `lucide` — see `components.json` for aliases). Feature components (`wiki-editor.tsx`, `wiki-article-viewer.tsx`, `wiki-card.tsx`, `nav/`) sit directly under `src/components`. Path alias `@/*` maps to `src/*`.

**Validation**: Zod schemas live in `src/validators/index.ts` (`signUpFormSchema`, `signInFormSchema`, `createArticleSchema`); corresponding inferred types are in `src/types/index.ts`. Forms use `react-hook-form` with `@hookform/resolvers`.
