# Theme Module (MUI)

## Rules

- All design tokens (colors, spacing, typography) live in `theme.ts` — never hardcode values in components
- Use `sx` prop for one-off styles, `styled()` for reusable styled components
- Access theme values via `theme.palette.*`, `theme.spacing()`, `theme.typography.*`
- Do not import from `@emotion/react` directly — use MUI's `styled` or `sx`

## Provider

`MuiProvider.tsx` is a Client Component (`"use client"`) that sets up Emotion SSR + MUI theme.
It is already added in `src/app/layout.tsx` — do not add it again.

## Adding theme overrides

Add component overrides in `theme.ts` under the `components:` key, not inline in components:

```ts
components: {
  MuiButton: {
    styleOverrides: {
      root: { borderRadius: 8 },
    },
  },
},
```
