import { PROJECTS, type TechTag } from "@/features/projects/data/projects";

const TECH_CANON: Record<string, TechTag> = {
  trpc: "tRPC",
  "t-rpc": "tRPC",
  next: "Next.js",
  nextjs: "Next.js",
  "next.js": "Next.js",
  react: "React",
  typescript: "TypeScript",
  ts: "TypeScript",
  zod: "Zod",
  postgres: "Postgres",
  postgresql: "Postgres",
  pgvector: "pgvector",
  rag: "RAG",
  llm: "LLM",
  openai: "OpenAI",
  supabase: "Supabase",
  drizzle: "Drizzle",
  mui: "MUI",
  "material ui": "MUI",
  "material-ui": "MUI",
  "tanstack query": "TanStack Query",
  "react query": "TanStack Query",
  "framer motion": "Framer Motion",
  framer: "Framer Motion",
  "chrome extension": "Chrome Extension",
  extension: "Chrome Extension",
  "npm package": "npm package",
  npm: "npm package",
  bim: "BIM/IFC",
  ifc: "BIM/IFC",
  telegram: "Telegram",
  graphql: "GraphQL",
};

export function matchTechTag(query: string): TechTag | null {
  const q = query.toLowerCase();
  for (const [alias, tag] of Object.entries(TECH_CANON)) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`\\b${escaped}\\b`).test(q)) return tag;
  }
  return null;
}

export function resolveProjects(opts: { chunkProjectIds: string[]; tech: TechTag | null }) {
  const ids = new Set(opts.chunkProjectIds);
  if (opts.tech) {
    PROJECTS.filter((p) => p.tech.includes(opts.tech!)).forEach((p) => ids.add(p.id));
  }
  return PROJECTS.filter((p) => ids.has(p.id));
}
