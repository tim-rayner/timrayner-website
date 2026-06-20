import OpenAI from "openai";
import { db } from "@/db";
import { chunks } from "@/db/schema";
import { sql } from "drizzle-orm";
import { PROJECTS } from "@/features/projects/data/projects";

const openai = new OpenAI();

const BIO_SOURCES = [
  {
    title: "About Tim",
    text: "Tim Rayner is a full-stack engineer specialising in TypeScript, React, Next.js, and tRPC. He builds product-grade web applications across construction tech, hospitality AI, developer tooling, and creative AI. He values clean architecture, domain-driven design, and shipping working software.",
  },
  {
    title: "Tim's approach",
    text: "Tim approaches engineering with a strong bias toward domain-driven design (DDD), vertical slice architecture, and type-safe APIs. He avoids over-abstraction and prefers explicit, readable code that survives team turnover. He has experience leading frontend teams and mentoring junior engineers.",
  },
  {
    title: "Tim's scaling approach",
    text: "Tim handles scaling through clear separation of concerns, server-side rendering for performance, database indexing (including vector indexes via pgvector), and incremental adoption of caching strategies. He prefers Postgres for most persistence needs and leans on connection pooling and query optimisation before reaching for distributed systems.",
  },
];

type Source = {
  projectId?: string;
  title: string;
  text: string;
};

async function run() {
  console.log("Clearing existing chunks…");
  await db.execute(sql`truncate table chunks restart identity`);

  const projectSources: Source[] = PROJECTS.map((p) => ({
    projectId: p.id,
    title: p.name,
    text: `${p.name} — ${p.tagline}. ${p.description} Tech stack: ${p.tech.join(", ")}.${p.domains ? ` Domain: ${p.domains.join(", ")}.` : ""}`,
  }));

  const allSources: Source[] = [...projectSources, ...BIO_SOURCES];

  console.log(`Embedding ${allSources.length} chunks…`);

  for (let i = 0; i < allSources.length; i += 100) {
    const batch = allSources.slice(i, i + 100);

    const embResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: batch.map((s) => s.text),
    });

    await db.insert(chunks).values(
      batch.map((s, j) => ({
        content: s.text,
        metadata: {
          projectId: s.projectId,
          title: s.title,
        },
        embedding: embResponse.data[j].embedding,
      }))
    );

    console.log(`  Inserted batch ${i / 100 + 1} (${batch.length} chunks)`);
  }

  console.log("Ingestion complete.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
