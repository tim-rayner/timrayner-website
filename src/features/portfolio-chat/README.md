# portfolio-chat

RAG-powered chat for `timrayner.com`. Visitors ask natural-language questions about Tim's work; capability questions ("Has Tim used tRPC?") return a verdict badge + project tiles.

## Architecture

```
User query
  → tRPC mutation `chat.ask`
  → embed query (OpenAI text-embedding-3-small)
  → match chunks in Supabase pgvector (cosine similarity > 0.3, top 6)
  → resolve candidate projects (vector hits ∪ tech-tag sweep over PROJECTS)
  → generate structured JSON response (gpt-4o-mini, temp 0.2)
  → hydrate Project[] from static PROJECTS array
  → return { answer, verdict, projects } to client
```

## Key files

| File | Role |
|------|------|
| `ChatSection.tsx` | Server Component wrapper — section layout and heading |
| `ChatClient.tsx` | Client Component — input, transcript, suggested prompts, debounce |
| `ChatProjectTiles.tsx` | Staggered AnimatePresence tile grid for assistant responses |
| `resolveProjects.ts` | Tech-tag normalisation + project resolution (vector ∪ tag sweep) |
| `../../api/routers/chat.ts` | tRPC `chat.ask` mutation (server-side only) |
| `../../../scripts/ingest.ts` | One-time content ingestion into pgvector |

## Projects data

Projects stay in `src/features/projects/data/projects.ts` as a static `PROJECTS` array — **never** in the database. Each project has a required `tech: TechTag[]` field that drives capability matching, and an optional `domains?: ProjectDomain[]` for domain-style queries.

## First-time setup

### 1. Supabase SQL (run once in Dashboard → SQL Editor)

```sql
-- 001_enable_vector.sql
create extension if not exists vector;
```

```sql
-- 002_match_chunks_fn.sql
-- (see supabase/migrations/002_match_chunks_fn.sql)
```

### 2. Drizzle migration (creates the chunks table)

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 3. Ingest content

```bash
npm run ingest
```

Re-run after editing any project's `description`, `tech`, or after adding a new project.

## Environment variables

Fill in `.env.local` at the project root:

| Variable | Used by | Where to find |
|----------|---------|---------------|
| `OPENAI_API_KEY` | chat.ask, ingest | platform.openai.com/api-keys |
| `DATABASE_URL` | Drizzle ORM, ingest | Supabase → Settings → Database → URI |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase client | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client | Supabase → Settings → API |

## Verdict logic

| Verdict | Meaning | Example |
|---------|---------|---------|
| `YES` | Tim has used this technology | "Has Tim used tRPC?" |
| `NO` | No evidence in portfolio | "Has Tim used Rust?" |
| `PARTIAL` | Adjacent or partial usage | "Has Tim used GraphQL?" |
| `NONE` | Non-capability question | "What is Structura?" |

## Adding a new project

1. Add the entry to `PROJECTS` in `src/features/projects/data/projects.ts`
2. Tag it with `tech: TechTag[]` and optionally `domains: ProjectDomain[]`
3. Re-run `npm run ingest` to embed its content
