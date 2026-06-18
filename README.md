# whatever-next

An opinionated Next.js starter for building full-stack apps with tRPC, Material UI, Supabase, and first-class LLM tooling support.

## Project intent

A batteries-included starting point that encodes stack decisions, DX conventions, and AI agent context into a single template. Clone it, run `npm install`, and every supported coding tool already knows how your project works.

## Stack decisions

| Category | Choice |
|----------|--------|
| Framework | Next.js 16 (App Router) + TypeScript strict |
| API | tRPC v11 |
| Validation | Zod |
| UI | MUI v7 + Emotion |
| Data fetching | TanStack Query v5 (via tRPC) |
| Auth | Supabase Auth |
| Database | Supabase Postgres + Drizzle ORM |
| Testing | Vitest + React Testing Library |

See `llm/rules/decisions.md` for the full list including TBD categories.

## Onboarding checklist

1. `npm install` — auto-syncs LLM rules for detected tools via postinstall
2. Copy `.env.example` to `.env.local` and fill in values
3. Define your domain language in `llm/rules/ubiquitous-language.md`
4. `npm run dev` — open [http://localhost:3000](http://localhost:3000)

## Project structure

```
src/
  api/          tRPC routers and server setup
  app/          Next.js App Router pages and layouts
  db/           Supabase client and Drizzle ORM schema
  lib/          tRPC client/server utilities
  theme/        MUI theme and providers
llm/
  config.json   Targets, defaults, and module-to-path mapping
  rules/        Canonical rule sources (edit these, not generated outputs)
  sync.mjs      Generator script (runs automatically on postinstall)
```

Each route follows the server/client split pattern:

```
src/app/example/
  page.tsx          Server Component — data fetching, metadata
  ExampleClient.tsx Client Component — interactivity
```

## Conventions

All conventions are encoded in `llm/rules/*.md` and synced to tool-specific formats on `npm install`. Key files:

- `llm/rules/root.md` — project-wide conventions, naming, git workflow, boundaries
- `llm/rules/decisions.md` — technology choices and TBD items
- `llm/rules/ubiquitous-language.md` — domain glossary (fill this in for your project)
- `llm/rules/api.md` — tRPC router conventions
- `llm/rules/app.md` — Next.js App Router conventions
- `llm/rules/db.md` — database conventions

## LLM rules system

Rule files are written once in `llm/rules/` and synced to every supported tool's expected format on `npm install`. The sync script auto-detects which tools are installed.

### Supported tools

| Tool | Generated file |
|------|----------------|
| Claude Code | `CLAUDE.md`, `src/*/CLAUDE.md` |
| Cursor | `.cursor/rules/*.mdc` (glob-scoped per module) |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Windsurf | `.windsurfrules` |
| Cline / Roo | `.clinerules` |
| OpenAI Codex | `AGENTS.md` |

> **Note:** Detection is heuristic-based (PATH + directory checks). Less common tools may not be detected reliably. Set a target to `true` in `llm/config.json` to force generation regardless of detection.

Generated files are git-ignored. Only `llm/rules/*.md` and `llm/config.json` are committed.

### Syncing manually

```bash
# Sync all detected tools
npm run sync-llm-rules

# Sync a specific tool
npm run sync-llm-rules -- --target cursor
```

### Adding a module

1. Create `llm/rules/{name}.md`
2. Add an entry to `llm/config.json`:
   ```json
   { "rule": "{name}.md", "path": "src/{name}", "description": "..." }
   ```
3. Run `npm run sync-llm-rules`

### Toggling tools

Set any target in `llm/config.json`:

```json
"targets": {
  "claudeCode": "auto",  // detect at runtime (default)
  "cursor": true,         // always generate
  "copilot": false        // never generate
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest |
| `npm run sync-llm-rules` | Sync all detected LLM rule targets |
| `npm run sync-llm-rules -- --target <tool>` | Sync a specific tool |
