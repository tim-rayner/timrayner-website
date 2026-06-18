# ADR 0001 — Dark-only palette, no light/dark toggle

**Status:** Accepted

## Context

The portfolio palette is built entirely around a dark navy background (`#0B0F1A`). A light/dark toggle was considered. Light-mode requires a fully separate palette design pass; storing the user's preference adds implementation complexity (localStorage/cookie + SSR hydration). The site's intent is a controlled aesthetic impression, not a user preference UI.

## Decision

The theme is dark-only (`palette.mode: "dark"`). No toggle will be provided.

## Consequences

- Simpler theme file; one palette to maintain.
- Future light-mode support would require designing a second palette from scratch and wiring a preference store — non-trivial to add later.
- Accepted trade-off: design intent takes priority over user preference for a personal portfolio.
