import { z } from "zod";
import OpenAI from "openai";
import { publicProcedure, router } from "@/api/trpc";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { PROJECTS } from "@/features/projects/data/projects";
import { matchTechTag, resolveProjects } from "@/features/portfolio-chat/resolveProjects";

const openai = new OpenAI();

const SYSTEM = `You are the assistant on Tim Rayner's portfolio site.
Answer ONLY from the provided context and project list. Be concise (2-4 sentences max).
If asked whether Tim has used a technology, start your answer with "Yes", "No", or "Partially".
Do not invent projects, dates, or facts not in the context.
If the context lacks a clear answer, say so honestly.
For questions outside Tim's portfolio (weather, general knowledge, etc.), politely decline and steer back to portfolio topics.`;

export const chatRouter = router({
  ask: publicProcedure
    .input(
      z.object({
        message: z.string().min(1).max(500),
        history: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          )
          .max(10)
          .default([]),
      })
    )
    .mutation(async ({ input }) => {
      // 1. embed the query
      const embResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: input.message,
      });
      const queryEmbedding = embResponse.data[0].embedding;
      const embeddingStr = JSON.stringify(queryEmbedding);

      // 2. retrieve matching chunks via pgvector
      const matches = await db.execute(sql`
        select id, content, metadata,
               1 - (embedding <=> ${embeddingStr}::vector) as similarity
        from chunks
        where 1 - (embedding <=> ${embeddingStr}::vector) > 0.3
        order by embedding <=> ${embeddingStr}::vector
        limit 6
      `);

      const rows = matches as unknown as Array<{
        content: string;
        metadata: { projectId?: string; title?: string };
      }>;

      const context = rows
        .map((r) => `Source: ${r.metadata?.title ?? "portfolio"}\n${r.content}`)
        .join("\n\n---\n\n");

      const chunkProjectIds = rows.flatMap((r) =>
        r.metadata?.projectId ? [r.metadata.projectId] : []
      );

      // 3. resolve candidate projects (vector hits ∪ tech-tag sweep)
      const tech = matchTechTag(input.message);
      const candidates = resolveProjects({ chunkProjectIds, tech });

      // 4. generate structured response
      const projectList = candidates
        .map((p) => `${p.id}: ${p.name} [${p.tech.join(", ")}]`)
        .join("\n");

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "system",
            content: `Context:\n${context || "(none — answer from general knowledge of the project list only)"}`,
          },
          {
            role: "system",
            content:
              `Candidate projects:\n${projectList || "(none)"}\n\n` +
              `Respond as JSON with exactly these keys:\n` +
              `{"answer": string, "verdict": "YES"|"NO"|"PARTIAL"|"NONE", "projectIds": string[]}\n` +
              `projectIds MUST be a subset of the candidate ids listed above. ` +
              `Use verdict "NONE" for non-capability questions (e.g. "What is Structura?").`,
          },
          ...input.history,
          { role: "user", content: input.message },
        ],
      });

      const raw = completion.choices[0].message.content ?? "{}";
      const parsed = JSON.parse(raw) as {
        answer: string;
        verdict: "YES" | "NO" | "PARTIAL" | "NONE";
        projectIds: string[];
      };

      const VALID_VERDICTS = new Set(["YES", "NO", "PARTIAL", "NONE"]);
      const verdict: "YES" | "NO" | "PARTIAL" | "NONE" = VALID_VERDICTS.has(parsed.verdict)
        ? parsed.verdict
        : "NONE";

      // Guard: the model occasionally echoes the verdict string as the answer — replace it.
      const RAW_VERDICT_PATTERN = /^(YES|NO|PARTIAL|NONE)\.?$/i;
      const answer =
        parsed.answer && !RAW_VERDICT_PATTERN.test(parsed.answer.trim())
          ? parsed.answer
          : "I don't have enough information to answer that from Tim's portfolio.";

      // 5. hydrate from static array — never trust model-returned IDs directly
      const candidateIds = new Set(candidates.map((p) => p.id));
      const projects = PROJECTS.filter(
        (p) => parsed.projectIds.includes(p.id) && candidateIds.has(p.id)
      );

      return {
        answer,
        verdict,
        projects,
      };
    }),
});
