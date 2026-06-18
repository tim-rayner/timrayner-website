# Database Module (Supabase + Drizzle)

## Architecture

- **Supabase** provides Postgres hosting and Auth
- **Drizzle ORM** manages schema definitions and queries
- Direct SQL access via `postgres.js` driver

## Conventions

- Define all tables in `src/db/schema.ts` using Drizzle's schema API
- Use `db` from `src/db/index.ts` for queries in tRPC procedures
- Use `supabase` from `src/db/supabase.ts` for auth and Supabase-specific features (storage, realtime)
- Run migrations via `drizzle-kit` — do not write raw migration SQL by hand
- Always validate inputs with Zod at the tRPC boundary before passing to DB queries
- Never expose the service role key to the client — `SUPABASE_SERVICE_ROLE_KEY` is server-only

## Example query in a tRPC procedure

```ts
import { db } from '@/db'
import { posts } from '@/db/schema'

export const postsRouter = router({
  list: publicProcedure.query(() => db.select().from(posts)),
})
```

## Schema changes

1. Edit `src/db/schema.ts`
2. Run `npx drizzle-kit generate` to create a migration
3. Run `npx drizzle-kit migrate` to apply
