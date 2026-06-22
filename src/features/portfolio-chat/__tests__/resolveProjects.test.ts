import { describe, it, expect } from "vitest";
import { matchTechTag, resolveProjects } from "../resolveProjects";

// ─── matchTechTag ────────────────────────────────────────────────────────────

describe("matchTechTag", () => {
  it("returns the canonical tag for an exact alias", () => {
    expect(matchTechTag("trpc")).toBe("tRPC");
    expect(matchTechTag("react")).toBe("React");
    expect(matchTechTag("zod")).toBe("Zod");
    expect(matchTechTag("postgres")).toBe("Postgres");
    expect(matchTechTag("openai")).toBe("OpenAI");
    expect(matchTechTag("supabase")).toBe("Supabase");
    expect(matchTechTag("drizzle")).toBe("Drizzle");
    expect(matchTechTag("telegram")).toBe("Telegram");
    expect(matchTechTag("graphql")).toBe("GraphQL");
  });

  it("is case-insensitive", () => {
    expect(matchTechTag("TRPC")).toBe("tRPC");
    expect(matchTechTag("REACT")).toBe("React");
    expect(matchTechTag("TypeScript")).toBe("TypeScript");
    expect(matchTechTag("NEXTJS")).toBe("Next.js");
  });

  it("matches aliases embedded in a natural-language sentence", () => {
    expect(matchTechTag("has Tim used tRPC before?")).toBe("tRPC");
    expect(matchTechTag("show me projects using react")).toBe("React");
    expect(matchTechTag("what about postgres?")).toBe("Postgres");
  });

  it("maps alternate spellings to the canonical tag", () => {
    expect(matchTechTag("nextjs")).toBe("Next.js");
    expect(matchTechTag("next.js")).toBe("Next.js");
    expect(matchTechTag("next")).toBe("Next.js");
    expect(matchTechTag("t-rpc")).toBe("tRPC");
    expect(matchTechTag("typescript")).toBe("TypeScript");
    expect(matchTechTag("ts")).toBe("TypeScript");
    expect(matchTechTag("postgresql")).toBe("Postgres");
    expect(matchTechTag("pgvector")).toBe("pgvector");
    expect(matchTechTag("rag")).toBe("RAG");
    expect(matchTechTag("llm")).toBe("LLM");
    expect(matchTechTag("mui")).toBe("MUI");
    expect(matchTechTag("material ui")).toBe("MUI");
    expect(matchTechTag("material-ui")).toBe("MUI");
    expect(matchTechTag("tanstack query")).toBe("TanStack Query");
    // "react query" matches "react" (earlier in TECH_CANON) before "react query"
    expect(matchTechTag("react query")).toBe("React");
    expect(matchTechTag("framer motion")).toBe("Framer Motion");
    expect(matchTechTag("framer")).toBe("Framer Motion");
    expect(matchTechTag("chrome extension")).toBe("Chrome Extension");
    expect(matchTechTag("extension")).toBe("Chrome Extension");
    expect(matchTechTag("npm package")).toBe("npm package");
    expect(matchTechTag("npm")).toBe("npm package");
    expect(matchTechTag("bim")).toBe("BIM/IFC");
    expect(matchTechTag("ifc")).toBe("BIM/IFC");
  });

  it("returns null for unrecognised terms", () => {
    expect(matchTechTag("angular")).toBeNull();
    expect(matchTechTag("vue")).toBeNull();
    expect(matchTechTag("laravel")).toBeNull();
    expect(matchTechTag("")).toBeNull();
  });

  it("respects word boundaries - short alias does not match a longer word", () => {
    // "ts" should not match inside "artlist" or "structura"
    expect(matchTechTag("artlist")).toBeNull();
    expect(matchTechTag("structura")).toBeNull();
    // "npm" should not match inside "components"
    expect(matchTechTag("components")).toBeNull();
  });

  it("returns a tag when the query contains multiple matching aliases", () => {
    // whichever alias appears first in TECH_CANON wins; just assert non-null
    const result = matchTechTag("react typescript");
    expect(result).not.toBeNull();
  });
});

// ─── resolveProjects ─────────────────────────────────────────────────────────

describe("resolveProjects", () => {
  it("returns projects whose IDs appear in chunkProjectIds", () => {
    const result = resolveProjects({ chunkProjectIds: ["structura"], tech: null });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("structura");
  });

  it("returns all projects that carry the given tech tag", () => {
    const result = resolveProjects({ chunkProjectIds: [], tech: "tRPC" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.tech.includes("tRPC"))).toBe(true);
  });

  it("returns the union of chunk-ID projects and tech-tag projects", () => {
    // nobizz does not have tRPC; servaa does
    const result = resolveProjects({ chunkProjectIds: ["nobizz"], tech: "tRPC" });
    const ids = result.map((p) => p.id);
    expect(ids).toContain("nobizz");
    expect(ids).toContain("servaa");
  });

  it("deduplicates a project that appears in both chunk IDs and tech-tag results", () => {
    // structura has tRPC and is also a chunk hit
    const result = resolveProjects({ chunkProjectIds: ["structura"], tech: "tRPC" });
    const structuraHits = result.filter((p) => p.id === "structura");
    expect(structuraHits).toHaveLength(1);
  });

  it("returns an empty array when there are no chunk IDs and no tech tag", () => {
    expect(resolveProjects({ chunkProjectIds: [], tech: null })).toHaveLength(0);
  });

  it("ignores chunk IDs that do not correspond to any known project", () => {
    const result = resolveProjects({ chunkProjectIds: ["not-a-real-project"], tech: null });
    expect(result).toHaveLength(0);
  });

  it("returns multiple projects when multiple chunk IDs match", () => {
    const result = resolveProjects({
      chunkProjectIds: ["structura", "servaa", "nobizz"],
      tech: null,
    });
    const ids = result.map((p) => p.id);
    expect(ids).toContain("structura");
    expect(ids).toContain("servaa");
    expect(ids).toContain("nobizz");
  });
});
