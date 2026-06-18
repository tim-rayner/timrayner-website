# Context — timrayner.com

Portfolio site for Tim Rayner, targeting engineering managers, CTOs, and startup founders.

---

## Design Palette

| Term | Hex | MUI slot | Role |
|---|---|---|---|
| Midnight Blue | `#0B0F1A` | `background.default` | Page, hero, section, footer backgrounds |
| Slate Gray | `#1E2430` | `background.paper` | Cards, code blocks, dividers |
| Royal Purple | `#7C5DFF` | `primary` | Brand colour — logo accent, name highlights, active nav, selected states |
| Electric Blue | `#4D8EFF` | `secondary` | Trust colour — links, tech badges, hover states |
| Cyber Teal | `#00D4C4` | `success` | Engineer colour — metrics, timeline achievements, success states |
| Soft Lilac | `#B39DFF` | `info` | Human colour — testimonials, personal story sections, decorative gradients |
| Signature Yellow | `#FFD700` | `cta` (custom) | Attention magnet — CTA buttons only; never used for text, backgrounds, or nav |

### Usage ratio (approximate)
- 70% Midnight Blue (backgrounds)
- 15% Slate Gray (surfaces)
- 10% Royal Purple (branding)
- 3% Electric Blue (technical content)
- 1% Cyber Teal (achievements)
- 1% Signature Yellow (CTA buttons only)

### Accessibility
All accent colours meet WCAG AA contrast (≥4.5:1) against `#0B0F1A`.
All `contrastText` values use `#0B0F1A` (dark) for contained components.
Royal Purple was adjusted from `#5B2DFF` (3.05:1) to `#7C5DFF` (4.55:1).
Electric Blue was adjusted from `#2563FF` (4.02:1) to `#4D8EFF` (6.10:1).
