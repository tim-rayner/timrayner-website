export type ProjectAccent = "primary" | "secondary" | "success" | "info";
export type ProjectStatus = "live" | "wip" | "concept";

export type TechTag =
  // Frameworks / runtimes
  | "Next.js"
  | "React"
  | "React Native"
  | "Expo"
  | "Node.js"
  | "Hono"
  | "NestJS"
  // Language / type system
  | "TypeScript"
  // API / validation
  | "tRPC"
  | "Zod"
  | "GraphQL"
  // Data / infra
  | "Supabase"
  | "Postgres"
  | "Drizzle"
  | "pgvector"
  | "Upstash"
  | "AWS S3"
  | "Stripe"
  // State / data-fetching
  | "TanStack Query"
  // Build / monorepo
  | "Nx"
  | "Rollup"
  // 3D / graphics
  | "Three.js"
  | "That Open Engine"
  | "BIM/IFC"
  // AI / ML
  | "OpenAI"
  | "Replicate"
  | "LLM"
  | "RAG"
  // UI / styling
  | "MUI"
  | "Tailwind"
  | "Framer Motion"
  // Maps / mobility
  | "Google Maps"
  | "GBFS"
  // Testing
  | "Vitest"
  | "Playwright"
  // Distribution / platform
  | "Chrome Extension"
  | "npm package"
  | "Telegram";

export type ProjectDomain =
  | "construction"
  | "hospitality"
  | "creative-ai"
  | "developer-tooling"
  | "mobility";

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
  tech: TechTag[];
  domains?: ProjectDomain[];
}

const STATUS_ORDER: Record<ProjectStatus, number> = {
  wip: 0,
  live: 1,
  concept: 2,
};

export const PROJECTS: Project[] = (
  [
    {
      id: "structura",
      name: "Structura",
      tagline: "Digital Twin for QA and handover documentation",
      description:
        "3D BIM environment for QA insepection and handover documentation. Giving handover managers a clearer view into their evidence and progress tracking ",
      logoChar: "ST",
      accent: "primary",
      status: "wip",
      websiteUrl: "https://structura-demo.vercel.app/",
      tech: ["Next.js", "TypeScript", "tRPC", "Drizzle", "Postgres", "Supabase", "BIM/IFC", "Three.js", "That Open Engine", "OpenAI", "LLM", "MUI", "TanStack Query", "Zod", "Framer Motion"],
      domains: ["construction"],
    },
    {
      id: "servaa",
      name: "Servaa",
      tagline: "The brain of hospitality",
      description:
        "AI/ML platform for the hospitality industry — reducing food waste, optimising staff rotas, and surfacing local produce sourcing insights for venue operators.",
      logoChar: "SV",
      accent: "secondary",
      status: "wip",
      websiteUrl: "https://servaa.io/",
      tech: ["Next.js", "TypeScript", "tRPC", "Drizzle", "Postgres", "Supabase", "LLM", "MUI", "TanStack Query", "Nx", "Zod", "Framer Motion", "Upstash", "Vitest", "Playwright"],
      domains: ["hospitality"],
    },
    {
      id: "threadvault",
      name: "ThreadVault",
      tagline: "Offline first architecture example",
      description:
        "A Simple Digital Construction QA tool for when making important documentation changes in an offline environment. Built to practice the concept of offline first architecture.",
      logoChar: "TV",
      accent: "success",
      status: "wip",
      tech: ["React Native", "TypeScript", "Expo"],
      domains: ["construction"],
    },
    {
      id: "artlist-ai-toolkit",
      name: "Artlist AI Toolkit",
      tagline: "AI tooling for content creators",
      description:
        "Creative AI Suite for content creators, video editors and filmakers. Generate images, videos, voicovers, and music from text, or edit existing images, videos or audio files. Used by millions of creatives worldwide every day.",
      logoChar: "AI",
      accent: "success",
      status: "live",
      websiteUrl: "https://toolkit.artlist.io/image-video-generator",
      company: "Artlist",
      companyLogoUrl: "/AL.png",
      tech: ["React", "TypeScript", "OpenAI", "LLM"],
      domains: ["creative-ai"],
    },
    {
      id: "react-esign",
      name: "React ESign",
      tagline: "Handwritten e-signatures for React",
      description:
        "Lightweight, dependency-free React component for capturing handwritten signatures — ideal for e-signatures, form authentication, and user confirmations.",
      logoChar: "RE",
      accent: "info",
      status: "live",
      websiteUrl: "https://react-esign-docs.vercel.app/",
      npmUrl: "https://www.npmjs.com/package/react-esign",
      tech: ["React", "TypeScript", "npm package", "Rollup"],
      domains: ["developer-tooling"],
    },
    {
      id: "nobizz",
      name: "NoBizz",
      tagline: "Read articles without the nonesense",
      description:
        "Chrome extension that strips sponsored posts, engagement bait, and algorithmic filler from articles, blog posts, and LinkedIn feeds. Tells you exactly why you clicked on the page in seconds, rather than minutes scrolling nonsense.",
      logoChar: "NB",
      accent: "secondary",
      status: "live",
      extensionHref:
        "https://chromewebstore.google.com/detail/nobizz-tldr/ccikhaedglnfhgcghciemgflgpifdjik",
      tech: ["Chrome Extension", "TypeScript", "LLM"],
      domains: ["developer-tooling"],
    },
    {
      id: "dreamdrive",
      name: "DreamDrive",
      tagline: "Your car. Any street. Any dream.",
      description:
        "Creative AI Suite for car enthusiasts. Place your dream car, in any location you can find on Google Maps, and let the AI generate a realistic render of the car exact to the location selected.",
      logoChar: "DD",
      accent: "info",
      status: "concept",
      githubHref: "https://github.com/tim-rayner/dream-drive",
      websiteUrl: "https://drivedream.vercel.app/",
      tech: ["Next.js", "TypeScript", "Replicate", "LLM", "Supabase", "MUI", "Tailwind", "Stripe", "AWS S3", "Google Maps", "Nx", "Framer Motion"],
      domains: ["creative-ai"],
    },
    {
      id: "startline",
      name: "Startline",
      tagline: "Beryl powered sustainable commuting",
      description:
        "Beryl powered sustainable commuting. Find the best way to get to work, based on your location, weather, and commute preferences.",
      logoChar: "SL",
      accent: "primary",
      status: "concept",
      tech: ["Next.js", "TypeScript", "GBFS"],
      domains: ["mobility"],
    },
  ] as Project[]
).sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
