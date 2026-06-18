# App Module (Next.js App Router)

## Page structure

Each route lives in `src/app/{name}/`:
- `page.tsx` — async Server Component; fetches data, exports `generateMetadata`
- `{Name}Client.tsx` — Client Component (`"use client"`); handles interactivity

Pass only serializable data from Server to Client components as props.

## Rules

- `page.tsx` should be `async` and `await` data directly — no `useEffect` for initial data
- Use `loading.tsx` and `error.tsx` for route-level loading/error states
- Layout-level providers live in `src/app/layout.tsx` — do not re-add them in pages
- Dynamic segments use `[param]` folders; access via `params` prop (typed as `Promise<{param: string}>` in Next.js 15+)

## Server vs Client

| Needs | Use |
|-------|-----|
| Data fetching, DB access, secrets | Server Component |
| `onClick`, `useState`, `useEffect` | Client Component |
| Both | Server fetches, passes to Client as props |
