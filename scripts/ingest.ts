import OpenAI from "openai";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { db } from "@/db";
import { chunks } from "@/db/schema";
import { sql } from "drizzle-orm";
import { PROJECTS } from "@/features/projects/data/projects";

const openai = new OpenAI();

/**
 * Enriched ingestion.
 *
 * Sources, in priority order:
 *   1. repo-context.json  — per-repo technical context crawled from GitHub
 *      (package.json / config / README signal). Each entry has a `seed` flag;
 *      ONLY entries with seed=true are embedded. Private repos containing
 *      client / employer / third-party material default to seed=false so they
 *      are never published to the public-facing chat without an explicit opt-in.
 *   2. PROJECTS array      — the curated portfolio tiles (name, tagline, tech).
 *   3. BIO_SOURCES         — hand-written background about Tim.
 *
 * The table is truncated and fully reloaded each run, so it is safe to re-run
 * after editing projects, tags, or the repo-context file.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

type RepoEntry = {
  projectId: string;
  repo: string | null;
  private: boolean;
  seed: boolean;
  seedReason?: string;
  title: string;
  purpose: string;
  discrepancyNote?: string;
  stack?: Record<string, string>;
  methodologies?: string;
  includes?: string[];
  tags?: string[];
};

type RepoContext = {
  _meta?: Record<string, unknown>;
  entries: RepoEntry[];
};

type Source = {
  projectId?: string;
  title: string;
  section?: string;
  text: string;
};

// ── Hand-written background ─────────────────────────────────────────────────────

const BIO_SOURCES: Source[] = [
  {
    title: "About Tim",
    section: "bio",
    text: "Tim Rayner is a full-stack engineer specialising in TypeScript, React, Next.js, and tRPC. He builds product-grade web applications across construction tech, hospitality AI, developer tooling, and creative AI. He values clean architecture, domain-driven design, and shipping working software.",
  },
  {
    title: "Tim's approach",
    section: "bio",
    text: "Tim approaches engineering with a strong bias toward domain-driven design (DDD), vertical slice architecture, and type-safe APIs. He avoids over-abstraction and prefers explicit, readable code that survives team turnover. He has experience leading frontend teams and mentoring junior engineers.",
  },
  {
    title: "Tim's scaling approach",
    section: "bio",
    text: "Tim handles scaling through clear separation of concerns, server-side rendering for performance, database indexing (including vector indexes via pgvector), and incremental adoption of caching strategies. He prefers Postgres for most persistence needs and leans on connection pooling and query optimisation before reaching for distributed systems.",
  },
  {
    title: "Tim's testing and tooling practices",
    section: "bio",
    text: "Tim layers his testing: Vitest or Jest for unit and integration, Playwright for end-to-end. He enforces the server/client boundary with server-only and client-only guards, uses Zod for runtime validation at API edges, and reaches for Nx when a project grows into a monorepo. He rate-limits public endpoints with Upstash before sharing them widely.",
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────────

function loadRepoContext(): RepoContext {
  // repo-context.json lives next to this script (scripts/repo-context.json).
  const path = join(process.cwd(), "scripts", "repo-context.json");
  return JSON.parse(readFileSync(path, "utf8")) as RepoContext;
}

/** Flatten a repo entry into a single dense, embeddable paragraph. */
function repoEntryToText(e: RepoEntry): string {
  const parts: string[] = [];
  parts.push(`${e.title}: ${e.purpose}`);

  if (e.stack && Object.keys(e.stack).length) {
    const stackLine = Object.entries(e.stack)
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ");
    parts.push(`Technical stack — ${stackLine}.`);
  }

  if (e.methodologies) parts.push(`Methodologies and practices: ${e.methodologies}`);
  if (e.includes?.length) parts.push(`Includes: ${e.includes.join("; ")}.`);
  if (e.tags?.length) parts.push(`Tech tags: ${e.tags.join(", ")}.`);
  if (e.discrepancyNote) parts.push(`Note: ${e.discrepancyNote}`);

  return parts.join(" ");
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

// ── Build source list ───────────────────────────────────────────────────────────

function buildSources(): Source[] {
  const ctx = loadRepoContext();

  const seeded = ctx.entries.filter((e) => e.seed);
  const skipped = ctx.entries.filter((e) => !e.seed);

  if (skipped.length) {
    console.log(`Skipping ${skipped.length} entr${skipped.length === 1 ? "y" : "ies"} (seed=false):`);
    for (const e of skipped) {
      console.log(`  - ${e.title} [${e.repo ?? "no repo"}] — ${e.seedReason ?? "no reason given"}`);
    }
  }

  // 1. Enriched repo-context entries (the deep technical signal).
  const repoSources: Source[] = seeded.map((e) => ({
    projectId: e.projectId.startsWith("_") ? undefined : e.projectId,
    title: e.title,
    section: "repo-context",
    text: repoEntryToText(e),
  }));

  // 2. Curated PROJECTS tiles. Kept as their own chunks so the tile-facing
  //    tagline/description is always represented even for repos we don't seed.
  const projectSources: Source[] = PROJECTS.map((p) => ({
    projectId: p.id,
    title: p.name,
    section: "project-tile",
    text: `${p.name} — ${p.tagline}. ${p.description} Tech stack: ${p.tech.join(", ")}.${
      p.domains ? ` Domain: ${p.domains.join(", ")}.` : ""
    }`,
  }));

  return [...repoSources, ...projectSources, ...BIO_SOURCES];
}

// ── Run ─────────────────────────────────────────────────────────────────────────

async function run() {
  const sources = buildSources();

  console.log("\nClearing existing chunks…");
  await db.execute(sql`truncate table chunks restart identity`);

  console.log(`Embedding ${sources.length} chunks…`);

  const BATCH = 100;
  for (let i = 0; i < sources.length; i += BATCH) {
    const batch = sources.slice(i, i + BATCH);
    const embeddings = await embedBatch(batch.map((s) => s.text));

    await db.insert(chunks).values(
      batch.map((s, j) => ({
        content: s.text,
        metadata: {
          projectId: s.projectId,
          title: s.title,
          section: s.section,
        },
        embedding: embeddings[j],
      }))
    );

    console.log(`  Inserted batch ${Math.floor(i / BATCH) + 1} (${batch.length} chunks)`);
  }

  console.log("\nIngestion complete.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
