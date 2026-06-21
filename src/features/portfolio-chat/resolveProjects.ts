import { PROJECTS, type TechTag } from "@/features/projects/data/projects";

const TECH_CANON: Record<string, TechTag> = {
  // Next.js
  next: "Next.js",
  nextjs: "Next.js",
  "next.js": "Next.js",
  // React
  react: "React",
  // React Native
  "react native": "React Native",
  rn: "React Native",
  // Expo
  expo: "Expo",
  // TypeScript
  typescript: "TypeScript",
  ts: "TypeScript",
  // tRPC
  trpc: "tRPC",
  "t-rpc": "tRPC",
  // Zod
  zod: "Zod",
  // GraphQL
  graphql: "GraphQL",
  // Node.js
  node: "Node.js",
  nodejs: "Node.js",
  "node.js": "Node.js",
  // Hono
  hono: "Hono",
  // NestJS
  nestjs: "NestJS",
  "nest.js": "NestJS",
  // Supabase
  supabase: "Supabase",
  // Postgres
  postgres: "Postgres",
  postgresql: "Postgres",
  // Drizzle
  drizzle: "Drizzle",
  // pgvector
  pgvector: "pgvector",
  // Upstash
  upstash: "Upstash",
  "upstash redis": "Upstash",
  // AWS S3
  "aws s3": "AWS S3",
  s3: "AWS S3",
  // Stripe
  stripe: "Stripe",
  // TanStack Query
  "tanstack query": "TanStack Query",
  "react query": "TanStack Query",
  tanstack: "TanStack Query",
  // Nx
  nx: "Nx",
  // Rollup
  rollup: "Rollup",
  // Three.js
  "three.js": "Three.js",
  three: "Three.js",
  threejs: "Three.js",
  // That Open Engine
  "that open engine": "That Open Engine",
  thatopen: "That Open Engine",
  // BIM/IFC
  bim: "BIM/IFC",
  ifc: "BIM/IFC",
  "web-ifc": "BIM/IFC",
  // OpenAI
  openai: "OpenAI",
  // Replicate
  replicate: "Replicate",
  // LLM
  llm: "LLM",
  // RAG
  rag: "RAG",
  // MUI
  mui: "MUI",
  "material ui": "MUI",
  "material-ui": "MUI",
  // Tailwind
  tailwind: "Tailwind",
  tailwindcss: "Tailwind",
  // Framer Motion
  "framer motion": "Framer Motion",
  framer: "Framer Motion",
  // Google Maps
  "google maps": "Google Maps",
  maps: "Google Maps",
  // GBFS
  gbfs: "GBFS",
  "bike share": "GBFS",
  // Vitest
  vitest: "Vitest",
  // Playwright
  playwright: "Playwright",
  // Chrome Extension
  "chrome extension": "Chrome Extension",
  extension: "Chrome Extension",
  // npm package
  "npm package": "npm package",
  npm: "npm package",
  // Telegram
  telegram: "Telegram",
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
