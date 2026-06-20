# Portfolio AI Chat — Technical Reference

End-to-end guide for the RAG pipeline powering the chat feature on `timrayner.com`.

**Stack:** gpt-4o-mini · text-embedding-3-small · pgvector · tRPC v11 · Drizzle

---

## 01 — Request lifecycle

### Step 1 · User submits a question

The visitor types a question and presses Enter or the send button. A 1-second client-side debounce prevents duplicate submissions. The message and conversation history are sent to the `chat.ask` tRPC mutation.

```
Input: { message: string (max 500), history: Turn[] (max 10) }
Validated by Zod at the tRPC boundary.
```

### Step 2 · Embed the query

The message is sent to OpenAI's embedding endpoint server-side. The API key never reaches the browser.

```
openai.embeddings.create({ model: "text-embedding-3-small" })
→ float[1536]  (~$0.00002 per query)
```

### Step 3 · Retrieve similar chunks (pgvector)

The query embedding is compared against all stored chunks using the cosine distance operator (`<=>`). Chunks scoring above 0.3 similarity are returned, ordered by relevance. Each chunk carries `metadata.projectId` linking it back to a static project.

```sql
select id, content, metadata,
       1 - (embedding <=> $query::vector) as similarity
from chunks
where 1 - (embedding <=> $query::vector) > 0.3
order by embedding <=> $query::vector
limit 6;
```

The `chunks` table has an HNSW index on the `embedding` column for fast approximate nearest-neighbour lookup.

### Step 4 · Resolve candidate projects

Two independent signals are unioned — neither alone is sufficient.

**Signal A — vector hits:** `metadata.projectId` values from the retrieved chunks. Good for topical questions ("what's Structura?").

**Signal B — tech-tag sweep:** The query is normalised to a `TechTag` (e.g. `"trpc"` → `"tRPC"`), then every project whose `tech[]` includes that tag is added. This is the completeness guarantee — it ensures every tRPC project appears even if its chunk ranked 7th and fell outside the top-6 window.

```ts
// resolveProjects.ts
const ids = new Set(chunkProjectIds);
if (tech) PROJECTS.filter(p => p.tech.includes(tech)).forEach(p => ids.add(p.id));
return PROJECTS.filter(p => ids.has(p.id));
```

> **Projects never touch the database.** The `PROJECTS` array in `projects.ts` is the only source of truth. Capability matching runs entirely in-process against TypeScript.

### Step 5 · Generate a structured response

The model receives: a system prompt scoped to portfolio content, retrieved chunk text as context, the candidate project list as a constraint, and conversation history. It must return JSON with exactly three keys.

```ts
// Required response shape
{
  answer:     string,
  verdict:    "YES" | "NO" | "PARTIAL" | "NONE",
  projectIds: string[]  // must be a subset of candidate ids
}
```

`temperature: 0.2` keeps answers factual. The prompt explicitly instructs that `projectIds` must come from the candidate list. (~$0.0001 per query)

### Step 6 · Hydrate & validate

Model-returned IDs are validated against two sets before any tile renders:

1. The candidate set built in step 4
2. The full static `PROJECTS` array

A hallucinated ID fails both checks and is silently dropped. The model influences _which_ projects render, but cannot invent one.

```ts
const candidateIds = new Set(candidates.map(p => p.id));
const projects = PROJECTS.filter(
  p => parsed.projectIds.includes(p.id) && candidateIds.has(p.id)
);
// returns { answer, verdict, projects: Project[] }
```

The tRPC return type is fully inferred — the client receives `Project[]` ready to pass straight to `ProjectTile`.

### Step 7 · Render to client

The client renders a verdict badge (if not `NONE`), the prose answer, and project tiles with staggered `AnimatePresence` animation. Tiles are safe to animate with `initial={{ opacity: 0 }}` because they never exist in the initial DOM — they only mount in response to a query response.

| Verdict | Meaning | Tiles |
|---------|---------|-------|
| `YES` | Tim has used this technology | Every matching project |
| `NO` | No evidence in portfolio | None |
| `PARTIAL` | Adjacent or related usage | Closest matches |
| `NONE` | Non-capability question | Normal (no badge shown) |

---

## 02 — Production setup

### 2.1 Environment variables

Fill in `.env.local` at the project root. Variables prefixed `NEXT_PUBLIC_` are safe to expose to the browser; all others are server-only.

| Variable | Used by | Where to find |
|----------|---------|---------------|
| `OPENAI_API_KEY` | `chat.ask`, `ingest` | platform.openai.com/api-keys |
| `DATABASE_URL` | Drizzle ORM, `ingest` | Supabase → Settings → Database → URI |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase JS client | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase JS client | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin ops (server-only) | Supabase → Settings → API |

### 2.2 Supabase SQL (run once)

Run in Supabase Dashboard → SQL Editor, in order. Both are idempotent.

```
supabase/migrations/001_enable_vector.sql   — enables the pgvector extension
supabase/migrations/002_match_chunks_fn.sql — creates the match_chunks RPC function
```

### 2.3 Create the chunks table

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 2.4 Install dependencies & ingest

```bash
npm install
npm run ingest
```

`npm run ingest` truncates and reloads the entire `chunks` table from the static `PROJECTS` array plus the bio copy in `scripts/ingest.ts`. Re-run it after:

- Editing any project's `description`, `tagline`, or `tech[]`
- Adding or removing a project
- Changing the bio/about copy in the ingest script

---

## 03 — Key design decisions

### Why do projects stay in a TypeScript array instead of the database?

Editing a project means editing a TypeScript file — the compiler validates every tag against the `TechTag` union and rejects typos at build time. There's no migration to write, no sync problem between a DB row and a tile component, and no risk of the UI and the data diverging. The Vitest guard (`every project has at least one tech tag`) enforces completeness.

The tradeoff is that changing project data requires a deploy. Acceptable for a personal portfolio.

### Why structured JSON instead of streamed text?

The client needs a `Project[]` array to render tiles — it can't wait for a stream to finish and then parse. The tRPC mutation model returns a single typed value, giving a clean end-to-end type contract.

**Streaming upgrade path (v2):** Move generation to a Route Handler, stream the prose, send `{ verdict, projectIds }` as a trailing JSON block after a sentinel. `resolveProjects` and the hydration/validation logic stay identical.

### Why two project resolution signals?

Vector search is bounded by top-K. If Tim has five tRPC projects and the question is "Has Tim used tRPC?", the fifth project's chunk might rank 8th and fall outside the window. The tech-tag sweep adds every project whose `tech[]` matches, regardless of vector rank. Vector provides topical depth; tags provide completeness for capability questions.

### What prevents the model from hallucinating project tiles?

Three layers:

1. The system prompt instructs `projectIds MUST be a subset of the candidate ids listed above`
2. The server validates every returned ID against the in-process candidate set
3. It validates again against the full static `PROJECTS` array

A hallucinated ID fails both checks and is silently dropped.

---

## 04 — File map

| File | Role |
|------|------|
| `src/features/portfolio-chat/ChatSection.tsx` | Server Component — section layout and heading |
| `src/features/portfolio-chat/ChatClient.tsx` | Client Component — input, transcript, suggested prompts, debounce |
| `src/features/portfolio-chat/ChatProjectTiles.tsx` | Staggered `AnimatePresence` tile grid |
| `src/features/portfolio-chat/resolveProjects.ts` | Tech-tag normalisation + project resolution logic |
| `src/api/routers/chat.ts` | `chat.ask` tRPC mutation (server-side only) |
| `src/features/projects/data/projects.ts` | Single source of truth for all project data and `TechTag` types |
| `src/db/schema.ts` | Drizzle `chunks` table definition |
| `supabase/migrations/` | pgvector extension + `match_chunks` RPC function SQL |
| `scripts/ingest.ts` | Content ingestion — embeds and loads all chunks |
