"use client";

import { RefObject, useEffect, useLayoutEffect, useState } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Scroll-reveal that is safe for SSR and browser back/forward navigation.
 *
 * Why not framer-motion initial="hidden":
 *   framer-motion serialises `initial` as inline CSS during SSR, so the server
 *   HTML has opacity:0 on content — invisible to crawlers and stuck invisible
 *   on back/forward when JS timing is off.
 *
 * This hook returns true (visible) in three cases:
 *   1. SSR — no inline style applied, content renders normally in HTML.
 *   2. Element is already in the viewport when the component mounts
 *      (back/forward restores scroll position before effects run).
 *   3. After the IntersectionObserver fires as the user scrolls down.
 *
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   const visible = useScrollReveal(ref);
 *   <div ref={ref} style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }} />
 */
export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  { margin = "-80px" }: { margin?: string } = {}
): boolean {
  // "ssr"    → component not yet mounted; render visible so SSR HTML has no hidden styles
  // "hidden" → mounted, element below fold; CSS transition will animate it in
  // "visible"→ in viewport (or already was on mount)
  const [state, setState] = useState<"ssr" | "hidden" | "visible">("ssr");

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      setState("visible");
      return;
    }

    const rect = el.getBoundingClientRect();
    const marginPx = parseInt(margin) || 0;
    // Positive margin shrinks the trigger zone; we check raw viewport here
    const alreadyInView = rect.top < window.innerHeight - Math.abs(marginPx);

    if (alreadyInView) {
      setState("visible");
      return;
    }

    setState("hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { rootMargin: margin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return state !== "hidden";
}
