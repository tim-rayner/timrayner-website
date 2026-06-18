# Technology Decisions

## Decided

| Category | Decision | Notes |
|----------|----------|-------|
| API framework | tRPC v11 | Type-safe end-to-end |
| UI library | MUI v7 | Material Design components |
| Validation | Zod | Runtime validation + static types |
| Data fetching | TanStack Query v5 | Via tRPC React Query integration |
| Auth | Supabase Auth | Hosted auth with RLS support |
| Database | Supabase Postgres + Drizzle ORM | Drizzle for schema/migrations, Supabase for hosting |
| Testing | Vitest + React Testing Library | Unit and integration tests |

## TBD

| Category | Status | Notes |
|----------|--------|-------|
| Email | TBD | Transactional email provider not yet chosen |
| File storage | TBD | S3-compatible, Supabase Storage, or other |
| Background jobs | TBD | Inngest, Trigger.dev, or built-in |
| State management | TBD | Beyond React Query — may not be needed |

## Agent protocol

- If a category is marked **TBD**, ask the developer before implementing anything in that category.
- After a TBD is resolved, move the row from TBD to Decided and record the choice.
- Do not introduce libraries that conflict with decided technologies (e.g., do not add a raw REST API layer alongside tRPC).
