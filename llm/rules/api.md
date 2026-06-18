# API Module (tRPC)

Routers live in `src/api/routers/` and are registered in `src/api/root.ts`.

## Router conventions

- One file per domain in `routers/` (e.g., `routers/posts.ts`)
- Register all routers in `root.ts` via `createTRPCRouter`
- Use `publicProcedure` for unauthenticated routes; extend for authenticated ones
- Always use `z.object({})` for inputs — never raw primitives at the top level

## Example

```ts
export const postsRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(({ input }) => {
      // ...
    }),
  create: publicProcedure
    .input(z.object({ title: z.string().min(1), body: z.string() }))
    .mutation(({ input }) => {
      // ...
    }),
})
```

## Error handling

- Throw `TRPCError` for expected failures, not plain `Error`
- `BAD_REQUEST` for validation, `NOT_FOUND` for missing resources, `UNAUTHORIZED`/`FORBIDDEN` for auth failures
