# PRD: Portfolio AI Chat Input (RAG + project tiles)

## 1. Summary

A chat input on `timrayner.com` that answers visitor questions about Tim's
work and background, and — for capability questions like "Has Tim used tRPC?" —
returns a verdict (YES / NO / PARTIAL) plus **project tiles** for every related
project, rendered with the existing `ProjectTile` component.

The retrieval-augmented generation (RAG) layer embeds the question, matches it
against a pgvector store of portfolio content chunks in Supabase, and passes the
retrieved context to OpenAI for a grounded, streamed answer. Project resolution
does **not** use the vector store: projects stay as the static, server-resident
`PROJECTS` array they are today, and the chat resolves related projects against
that array in-process.

**Stack (matches the repo):** Next.js 16 App Router · tRPC v11 · Zod · MUI v7 +
Emotion · TanStack Query v5 · Supabase (pgvector) · Drizzle (chunks table only).
OpenAI for embeddings + generation.

## 2. Key constraint: projects stay out of the database

`src/features/projects/data/projects.ts` exports a typed `PROJECTS: Project[]`
array. It is the single source of truth for tiles and is **not** persisted in a
DB — and must stay that way. Consequences for this feature:

- Supabase holds **only** embedded content chunks. No `projects` table, no join table.
- Each chunk's `metadata` carries the `projectId` it belongs to (null for general/bio content).
- Capability matching ("has Tim used X?") runs in-process over `PROJECTS` using a new `tech` tag field — not via SQL.
- Editing a project = editing the TS array (+ re-running ingestion for its prose). No migration.

## 3. Goals / Non-goals

**Goals**
- Natural-language Q&A grounded in portfolio content; hedge when context is thin.
- Capability questions return a verdict + tiles for **every** project with the relevant tech — completeness matters, not just the top vector hit.
- Reuse the existing `ProjectTile` / `Project` shape; tiles in chat look identical to the grid.
- Keep projects in the static `PROJECTS` array; only chunks go to Supabase.
- Stream the prose answer; keep OpenAI/Supabase keys server-side only.
- Fit the repo's conventions: tRPC procedure, `features/` folder, `@/` alias, Zod input, Vitest.

**Non-goals**
- Persisting projects (or chat history) in a DB.
- Auth / accounts.
- Real-time ingestion (it's a manual/CI script).
- General-purpose assistant behaviour beyond portfolio scope.

## 4. User stories

- "Has Tim used tRPC?" → **YES** verdict + tiles for every project tagged `tRPC`, each opening the existing project modal.
- "What's Structura?" → concise grounded summary + the Structura tile.
- "Has he done anything with Rust?" (untagged) → **NO** (or **PARTIAL** pointing at the closest adjacent work), no misleading tiles.
- "What's the weather?" → polite out-of-scope decline, steers back to portfolio topics.

## 5. Data model changes

### 5.1 `Project` interface — add `tech` (and optional `tags`)

Extend the existing interface in `src/features/projects/data/projects.ts`.

```ts
// Controlled vocabulary — single source of truth for capability matching.
// A union (not string[]) so every project tags from the same list, the
// compiler rejects typos, and incoming queries normalise against one canon.
export type TechTag =
  | "Next.js" | "React" | "TypeScript" | "tRPC" | "Zod"
  | "Node.js" | "Hono" | "NestJS"
  | "Supabase" | "Postgres" | "Drizzle" | "pgvector"
  | "MUI" | "TanStack Query" | "Framer Motion"
  | "OpenAI" | "LLM" | "RAG"
  | "Chrome Extension" | "npm package"
  | "BIM/IFC" | "Telegram" | "GraphQL";
  // extend as projects are added — keep alphabetical-ish within groups

// Domain/category axis — separate from tech, optional, free for now.
export type ProjectDomain = "construction" | "hospitality" | "creative-ai" | "developer-tooling" | "mobility";

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logoChar: string;
  accent: ProjectAccent;
  status: ProjectStatus;
  href?: string;
  websiteUrl?: string;
  githubHref?: string;
  npmUrl?: string;
  extensionHref?: string;
  company?: string;
  companyLogoUrl?: string;
  // NEW
  tech: TechTag[];          // required — drives the capability verdict
  domains?: ProjectDomain[]; // optional — for "construction projects?" style queries
}
```

Then add `tech` to each entry, e.g.:

```ts
{
  id: "structura",
  name: "Structura",
  // ...existing fields...
  tech: ["Next.js", "TypeScript", "BIM/IFC", "Telegram", "LLM"],
  domains: ["construction"],
},
{
  id: "servaa",
  name: "Servaa",
  // ...
  tech: ["Next.js", "TypeScript", "Supabase", "Drizzle", "tRPC", "LLM"],
  domains: ["hospitality"],
},
{
  id: "react-esign",
  name: "React ESign",
  // ...
  tech: ["React", "TypeScript", "npm package"],
  domains: ["developer-tooling"],
},
// ...remaining projects
```

> Tagging is content, not metadata-as-afterthought: the verdict is only as
> good as these arrays. A short Vitest test (5.4) guards against an untagged
> project shipping.

### 5.2 Supabase: chunks only

```sql
create extension if not exists vector;

create table chunks (
  id         bigint generated always as identity primary key,
  content    text not null,
  -- metadata.projectId links a chunk to a PROJECTS entry (or null for bio/general)
  metadata   jsonb not null default '{}'::jsonb,  -- { projectId, title, section }
  embedding  vector(1536),                         -- text-embedding-3-small
  created_at timestamptz default now()
);

create index on chunks using hnsw (embedding vector_cosine_ops);
```

Drizzle schema (the repo already uses Drizzle) in `src/db/schema.ts`:

```ts
import { pgTable, bigint, text, jsonb, timestamp, customType } from "drizzle-orm/pg-core";

const vector = customType<{ data: number[]; driverData: string }>({
  dataType: () => "vector(1536)",
  toDriver: (v) => JSON.stringify(v),
});

export const chunks = pgTable("chunks", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<{ projectId?: string; title?: string; section?: string }>().notNull().default({}),
  embedding: vector("embedding"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 5.3 Retrieval RPC (returns chunk + its projectId)

```sql
create or replace function match_chunks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (id bigint, content text, metadata jsonb, similarity float)
language sql stable as $$
  select c.id, c.content, c.metadata,
         1 - (c.embedding <=> query_embedding) as similarity
  from chunks c
  where 1 - (c.embedding <=> query_embedding) > match_threshold
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
```

### 5.4 Tagging guard (Vitest)

```ts
import { PROJECTS } from "@/features/projects/data/projects";

it("every project has at least one tech tag", () => {
  for (const p of PROJECTS) expect(p.tech.length).toBeGreaterThan(0);
});
```

## 6. How a query resolves to projects

Two independent signals, unioned — neither alone is sufficient:

1. **Vector-derived (relevance):** chunks returned by `match_chunks` carry
   `metadata.projectId`. Collect those IDs → the projects the *content* is about.
   Good for "what's Structura?" and topical questions.

2. **Tech-tag-derived (completeness):** for capability questions, normalise the
   query to a `TechTag` and select **all** `PROJECTS` whose `tech` includes it.
   This is the part that guarantees *every* tRPC project shows up even if its
   chunk ranked 8th and fell outside the top-K.

```ts
// src/features/chat/resolveProjects.ts
import { PROJECTS, type TechTag } from "@/features/projects/data/projects";

const TECH_CANON: Record<string, TechTag> = {
  trpc: "tRPC", "t-rpc": "tRPC",
  next: "Next.js", nextjs: "Next.js", "next.js": "Next.js",
  postgres: "Postgres", postgresql: "Postgres",
  pgvector: "pgvector", rag: "RAG", llm: "LLM",
  supabase: "Supabase", drizzle: "Drizzle", mui: "MUI",
  // ...one entry per alias; keep beside the TechTag union
};

export function matchTechTag(query: string): TechTag | null {
  const q = query.toLowerCase();
  for (const [alias, tag] of Object.entries(TECH_CANON)) {
    if (new RegExp(`\\b${alias.replace(".", "\\.")}\\b`).test(q)) return tag;
  }
  return null;
}

export function resolveProjects(opts: { chunkProjectIds: string[]; tech: TechTag | null }) {
  const ids = new Set(opts.chunkProjectIds);
  if (opts.tech) PROJECTS.filter((p) => p.tech.includes(opts.tech!)).forEach((p) => ids.add(p.id));
  return PROJECTS.filter((p) => ids.has(p.id)); // returns full Project objects for tiles
}
```

## 7. Server: tRPC procedure (`chat.ask`)

The repo uses tRPC v11 with a single `appRouter`; add a `chat` router rather
than a bare route handler, to match conventions. tRPC handles JSON in/out fine
for v1 (verdict + prose + project IDs in one response). Streaming is deferred to
§10 to keep v1 simple and on-pattern.

```ts
// src/api/routers/chat.ts
import { z } from "zod";
import OpenAI from "openai";
import { publicProcedure, router } from "@/api/trpc";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";
import { PROJECTS } from "@/features/projects/data/projects";
import { matchTechTag, resolveProjects } from "@/features/chat/resolveProjects";

const openai = new OpenAI();

const SYSTEM = `You are the assistant on Tim Rayner's portfolio site.
Answer ONLY from the provided context and project list. Be concise.
If asked whether Tim has used a technology, start with "Yes", "No", or "Partially".
Do not invent projects, dates, or facts. If the context lacks the answer, say so.`;

export const chatRouter = router({
  ask: publicProcedure
    .input(z.object({
      message: z.string().min(1).max(500),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).max(10).default([]),
    }))
    .mutation(async ({ input }) => {
      // 1. embed
      const emb = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: input.message,
      });
      const queryEmbedding = emb.data[0].embedding;

      // 2. retrieve chunks (pgvector via Drizzle raw SQL)
      const matches = await db.execute(sql`
        select id, content, metadata,
               1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
        from chunks
        where 1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) > 0.3
        order by embedding <=> ${JSON.stringify(queryEmbedding)}::vector
        limit 6
      `);

      const rows = matches as unknown as Array<{ content: string; metadata: { projectId?: string; title?: string } }>;
      const context = rows.map((r) => `Source: ${r.metadata?.title ?? "portfolio"}\n${r.content}`).join("\n\n---\n\n");
      const chunkProjectIds = rows.map((r) => r.metadata?.projectId).filter(Boolean) as string[];

      // 3. resolve candidate projects (vector ∪ tech tags)
      const tech = matchTechTag(input.message);
      const candidates = resolveProjects({ chunkProjectIds, tech });

      // 4. generate — structured output for the verdict + chosen ids
      const projectList = candidates.map((p) => `${p.id}: ${p.name} [${p.tech.join(", ")}]`).join("\n");
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "system", content: `Context:\n${context || "(none)"}` },
          { role: "system", content:
            `Candidate projects:\n${projectList || "(none)"}\n\n` +
            `Respond as JSON: {"answer": string, "verdict": "YES"|"NO"|"PARTIAL"|"NONE", "projectIds": string[]}. ` +
            `projectIds MUST be a subset of the candidate ids above. Use "NONE" verdict for non-capability questions.` },
          ...input.history,
          { role: "user", content: input.message },
        ],
      });

      const parsed = JSON.parse(completion.choices[0].message.content!) as {
        answer: string; verdict: "YES" | "NO" | "PARTIAL" | "NONE"; projectIds: string[];
      };

      // 5. hydrate full Project objects from the static array (never trust model to invent)
      const valid = new Set(candidates.map((p) => p.id));
      const projects = PROJECTS.filter((p) => parsed.projectIds.includes(p.id) && valid.has(p.id));

      return { answer: parsed.answer, verdict: parsed.verdict, projects };
    }),
});
```

Register it:

```ts
// src/api/root.ts
import { router } from "@/api/trpc";
import { helloRouter } from "@/api/routers/hello";
import { chatRouter } from "@/api/routers/chat";

export const appRouter = router({
  hello: helloRouter,
  chat: chatRouter,
});
export type AppRouter = typeof appRouter;
```

> **Why `response_format: json_object` instead of the sentinel-streaming trick
> from earlier drafts:** tRPC mutations return a single typed value, and the
> client needs `Project[]` it can hand straight to `ProjectTile`. Structured
> JSON gives a clean, typed contract end-to-end. The cost is no token streaming
> in v1 — acceptable for short answers; see §10 for the streaming upgrade path.

## 8. Client: `features/chat`

A new feature folder mirroring `features/projects`. Server/client split per repo
convention. Uses the existing tRPC client + TanStack Query, MUI, and reuses
`ProjectTile`.

```
src/features/chat/
  ChatSection.tsx     Server Component wrapper (heading, layout)
  ChatClient.tsx      Client Component — input, transcript, mutation
  ChatProjectTiles.tsx Renders Project[] via the existing ProjectTile
  resolveProjects.ts  (from §6)
  index.ts
```

```tsx
// src/features/chat/ChatClient.tsx
"use client";
import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { trpc } from "@/lib/trpc/client";
import { ProjectTile } from "@/features/projects/ProjectTile";
import { useProjectModal } from "@/features/projects/ModalProvider"; // existing open() hook
import type { Project } from "@/features/projects";

type Turn = { role: "user" | "assistant"; content: string; projects?: Project[]; verdict?: string };

export function ChatClient() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const { openProject } = useProjectModal();

  const ask = trpc.chat.ask.useMutation({
    onSuccess: (res) =>
      setTurns((t) => [...t, { role: "assistant", content: res.answer, projects: res.projects, verdict: res.verdict }]),
  });

  function send() {
    const message = input.trim();
    if (!message || ask.isPending) return;
    const history = turns.map((t) => ({ role: t.role, content: t.content }));
    setTurns((t) => [...t, { role: "user", content: message }]);
    setInput("");
    ask.mutate({ message, history });
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {turns.map((t, i) => (
          <Box key={i}>
            <Typography sx={{ fontWeight: t.role === "user" ? 600 : 400 }}>{t.content}</Typography>
            {t.projects && t.projects.length > 0 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 1.5,
                  mt: 1,
                }}
              >
                {t.projects.map((p, idx) => (
                  <ProjectTile
                    key={p.id}
                    project={p}
                    index={idx}
                    accentColor="" /* resolved by tile from project.accent */
                    onOpen={openProject}
                    onContextMenu={() => {}}
                  />
                ))}
              </Box>
            )}
          </Box>
        ))}
        {ask.isPending && <Typography sx={{ opacity: 0.5 }}>Thinking…</Typography>}
      </Box>
      <TextField
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Ask about my work — e.g. 'Has Tim used tRPC?'"
        fullWidth
        size="small"
      />
    </Box>
  );
}
```

> `ProjectTile` already takes `{ project, index, accentColor, onOpen,
> onContextMenu, viewMode }` and resolves colour from `project.accent`, so chat
> tiles match the grid for free. Verify the exact `accentColor` resolution
> against `ProjectsGrid.tsx` and pass the same value it does.

## 9. Ingestion (build-time script)

`scripts/ingest.ts` — content only; no project rows.

1. Read sources: each project's prose (description + any long-form MDX), the bio/about copy.
2. For project-derived content, set `metadata.projectId` to the matching `PROJECTS` id; bio content gets none.
3. Chunk (~500–800 tokens, heading-aware), embed with `text-embedding-3-small` (batch ≤100), insert into `chunks`.
4. Wipe + reload is fine at this scale.

```ts
import OpenAI from "openai";
import { db } from "@/db/client";
import { chunks } from "@/db/schema";
import { sql } from "drizzle-orm";
import { PROJECTS } from "@/features/projects/data/projects";

const openai = new OpenAI();

// Seed chunks straight from the static array's prose, tagged by projectId
const sources = PROJECTS.map((p) => ({
  projectId: p.id,
  title: p.name,
  text: `${p.name} — ${p.tagline}. ${p.description} Tech: ${p.tech.join(", ")}.`,
}));
// + bio/about sources with no projectId

async function run() {
  await db.execute(sql`truncate table chunks restart identity`);
  for (let i = 0; i < sources.length; i += 100) {
    const batch = sources.slice(i, i + 100);
    const emb = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: batch.map((s) => s.text),
    });
    await db.insert(chunks).values(batch.map((s, j) => ({
      content: s.text,
      metadata: { projectId: s.projectId, title: s.title },
      embedding: emb.data[j].embedding,
    })));
  }
}
run();
```

> Because each project's `tech` list is embedded into its chunk text, vector
> search alone already does a decent job on capability questions — the
> in-process `tech` filter in §6 is the guarantee on top, not the only signal.

## 10. Cross-cutting + upgrade paths

- **Env (server-only, never `NEXT_PUBLIC_`):** `OPENAI_API_KEY`, `DATABASE_URL` (Supabase, already present for Drizzle). The chat procedure reads them server-side.
- **Rate limiting:** wrap `chat.ask` with a per-IP limiter (Upstash) to cap OpenAI spend.
- **Grounding:** `temperature: 0.2`, context-only system prompt, model can only pick from candidate IDs, and the server re-validates picks against `PROJECTS` — a hallucinated ID can never become a tile.
- **Cost:** `text-embedding-3-small` + `gpt-4o-mini` ≈ negligible per query.
- **Streaming (v2):** if you want token streaming, move generation to a Route Handler returning a `ReadableStream` for the prose, and send `{ verdict, projectIds }` as a trailing JSON block after a sentinel; keep `resolveProjects`/validation identical. Or adopt the Vercel AI SDK and stream structured data.
- **Embedding dim:** `text-embedding-3-small` = 1536, matching `vector(1536)`. Switching to `-large` (3072) means altering the column + re-ingesting.

## 11. Acceptance criteria

1. `Project` has a required typed `tech: TechTag[]`; all existing projects tagged; Vitest guard passes.
2. Projects remain in the static `PROJECTS` array — no `projects` table in Supabase.
3. "Has Tim used tRPC?" returns verdict **YES** and a tile for **every** project tagged `tRPC`, rendered via `ProjectTile`, opening the existing modal on click.
4. A capability question for an untagged tech returns **NO/PARTIAL** with no misleading tiles.
5. Topical questions ("what's Structura?") return a grounded answer + the relevant tile(s).
6. Out-of-scope questions are declined politely.
7. No OpenAI/DB key reaches the client bundle.
8. Re-running ingestion after editing a project's prose/tags updates answers.
