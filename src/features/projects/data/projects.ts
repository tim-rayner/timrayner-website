export type ProjectAccent = "primary" | "secondary" | "success" | "info";
export type ProjectStatus = "live" | "wip" | "concept";

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
      tagline: "Digital construction assistant",
      description:
        "AI-powered BIM platform for the construction industry — automating IFC workflows, QA checks, and grout joint generation from a collaborative digital canvas.",
      logoChar: "ST",
      accent: "primary",
      status: "wip",
      websiteUrl: "https://structura-demo.vercel.app/",
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
    },
    {
      id: "threadvault",
      name: "ThreadVault",
      tagline: "Save and resurface X threads",
      description:
        "Personal archive for Twitter/X threads — clip, tag, and search with full-text indexing and Obsidian export.",
      logoChar: "TV",
      accent: "success",
      status: "wip",
    },
    {
      id: "artlist-ai-toolkit",
      name: "Artlist AI Toolkit",
      tagline: "AI tooling for content creators",
      description:
        "Internal suite of AI tools built at Artlist — automating media tagging, similarity search, and content recommendation at scale.",
      logoChar: "AI",
      accent: "success",
      status: "live",
      websiteUrl: "https://toolkit.artlist.io/image-video-generator",
      company: "Artlist",
      companyLogoUrl: "/AL.png",
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
    },
    {
      id: "nobizz",
      name: "NoBizz",
      tagline: "LinkedIn without the noise",
      description:
        "Chrome extension that strips sponsored posts, engagement bait, and algorithmic filler from your LinkedIn feed. Just the signal.",
      logoChar: "NB",
      accent: "secondary",
      status: "live",
      extensionHref:
        "https://chromewebstore.google.com/detail/nobizz-tldr/ccikhaedglnfhgcghciemgflgpifdjik",
    },
    {
      id: "dreamdrive",
      name: "DreamDrive",
      tagline: "Your car. Any street. Any dream.",
      description:
        "AI-curated road trip planner — scenic route curation, music mood matching, and offline-first itinerary export.",
      logoChar: "DD",
      accent: "info",
      status: "concept",
      githubHref: "https://github.com/tim-rayner/dream-drive",
      websiteUrl: "https://drivedream.vercel.app/",
    },
    {
      id: "startline",
      name: "Startline",
      tagline: "Zero-to-shipped in under an hour",
      description:
        "Opinionated Next.js starter that wires up auth, database, payments, and deployment with a single CLI command.",
      logoChar: "SL",
      accent: "primary",
      status: "concept",
    },
  ] as Project[]
).sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
