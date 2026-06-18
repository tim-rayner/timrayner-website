Build a flawless, professional hero section for timrayner.com as a vertical-slice feature.

Context:
This is a portfolio site for Tim Rayner, a full-stack TypeScript/software engineer. The design direction should blend the attached references: editorial portfolio layout, confident personal branding, clean spacing, subtle creative details, and a premium dark/tech feel. The hero should feel recruiter-ready, not gimmicky.

Asset:
Use my portrait SVG: `tim.png`.

Feature location:
Create this as a self-contained feature under the vertical slice architecture, for example:

`src/features/hero/`

Suggested structure:

- `src/features/hero/components/HeroSection.tsx`
- `src/features/hero/index.ts`
- optional supporting components if useful

Requirements:

- Use React / Next.js conventions.
- Use TypeScript.
- Keep the component clean, reusable, and production-quality.
- Use semantic HTML.
- Ensure excellent responsive behaviour from mobile to desktop.
- Prioritise accessibility, contrast, and keyboard-safe CTA links.
- Use `tim.png` as the main visual portrait.
- Do not hard-code messy one-off styling inside JSX if the project has an established styling system.
- Match the site’s existing design tokens/theme if available.
- If no theme exists, create clean class-based styling using the existing styling approach.

Hero content:
Headline:
“Building digital products, brands & scalable experiences.”

Supporting copy:
“I’m Tim Rayner, a Full-Stack Software Engineer focused on user experience, scalable systems, and product-minded software delivery.”

Primary CTA:
“View my work”

Secondary CTA:
“Read my story”

Visual direction:

- Large typographic headline on the left.
- Portrait image on the right using `tim.png`.
- Dark/premium background or elevated card layout depending on current site direction.
- Use subtle decorative elements inspired by the references: small accent shapes, fine lines, soft gradients, or minimal interface details.
- Avoid clutter.
- Avoid generic SaaS landing page styling.
- The section should feel personal, memorable, and highly professional.

Design goals:

- Recruiters should instantly understand what I do.
- The section should look polished enough for a senior frontend/full-stack portfolio.
- The layout should have strong visual hierarchy.
- It should communicate user experience, scalability, and infrastructure as key interests.
- It should feel creative but credible.

Acceptance criteria:

- Fully responsive.
- No layout shift from the SVG image.
- Accessible heading structure.
- CTA buttons are obvious and usable.
- Code is clean, typed, and easy to extend.
- Exports cleanly from the feature index.
- No placeholder lorem ipsum.
- No unused imports.
