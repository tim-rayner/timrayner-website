# Project Rules

This is a Next.js application using the App Router, tRPC for type-safe APIs, and Material UI for components.

## Stack

- **Framework**: Next.js (App Router) with TypeScript
- **API**: tRPC v11 with Zod validation
- **UI**: Material UI (MUI) v7 with Emotion
- **Data fetching**: TanStack Query via tRPC hooks
- **Auth**: Supabase Auth
- **Database**: Supabase Postgres + Drizzle ORM

## Agent protocol

Before choosing a library or technology:

1. Check `decisions.md` for the decided choice.
2. If the category is **TBD**, ask the developer before proceeding. After deciding, update `decisions.md`.
3. Do not introduce libraries that conflict with decided technologies.

## General conventions

- Use TypeScript strict mode — no `any`, no type assertions unless unavoidable
- Server Components by default; add `"use client"` only when needed (event handlers, hooks, browser APIs)
- All API routes go through tRPC — do not create raw Next.js API route handlers
- Use `zod` for all runtime validation at API boundaries
- No hardcoded design tokens (colors, spacing) — use the MUI theme
- Only use comments when the code cannot be self-described clearly — complex algorithms, regex, or non-obvious logic only

## Directory layout

<!-- sync-llm-rules:directory-layout:start -->
- `src/api/` — tRPC API routers and setup
- `src/app/` — Next.js App Router pages and layouts
- `src/db/` — Supabase client and Drizzle ORM schema
- `src/lib/` — Shared utilities and tRPC client setup
- `src/theme/` — MUI theme configuration
<!-- sync-llm-rules:directory-layout:end -->
## Page structure

Each route lives in `src/app/{name}/`:

- `page.tsx` — Server Component; handles data fetching and exports metadata
- `{Name}Client.tsx` — Client Component; handles interactivity, passed data as props

## Naming conventions

- Directories: `kebab-case`
- React components: `PascalCase`; interactive route clients named `{Name}Client.tsx`
- Functions and constants: `camelCase`
- Event handlers: `handle` prefix (e.g., `handleSubmit`)
- Domain terms: follow glossary in `ubiquitous-language.md`

## Git workflow

- Branch naming: `feature/`, `fix/`, `chore/`
- Commit messages: conventional commits preferred (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`)
- Run lint and build before committing when possible
- Never commit secrets, API keys, or `.env` files

## Boundaries

**Always do:**
- Route all API behavior through tRPC (`src/api/`)
- Validate tRPC inputs with Zod objects
- Keep theme values in `src/theme/theme.ts` — no hardcoded palette or spacing in feature code
- Respect server/client boundaries in App Router files

**Ask first:**
- Adding new dependencies
- Introducing new top-level architecture patterns
- Modifying shared cross-cutting infrastructure

**Never do:**
- Add raw Next.js API handlers that bypass tRPC
- Commit secrets or API keys
- Edit generated rule files as canonical source — update `llm/rules/*.md` and re-run sync

## Hallucination guardrails

Do not assume any of the following without verifying in code:

- There is no Nx workspace — use `npm` scripts and Next.js tooling only
- Do not create raw API route handlers for business APIs — use tRPC routers
- Do not fetch initial route data with client `useEffect` when a Server Component can fetch it
- Do not hardcode colors, spacing, or typography — use MUI theme tokens
- Do not hand-edit generated rule outputs as source of truth — update `llm/rules/*.md` and run sync
- Do not introduce unapproved domain synonyms when glossary terms already exist

## DDD terminology checklist

Before writing or refactoring domain-facing code, check:

- Which glossary terms from `ubiquitous-language.md` apply to this change?
- Are names in code, API contracts, and tests aligned with approved domain terms?
- Did this change introduce a synonym for an existing term? If yes, rename it.
- If a new term is required, add it to the glossary first and then apply it consistently.
