"use client";

import { Box, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useState } from "react";

const MotionBox = motion(Box);

export interface TechItem {
  name: string;
  /** simple-icons slug — see https://simpleicons.org */
  slug: string;
  /** Override the icon source URL entirely (e.g. devicons CDN for icons missing from simple-icons) */
  src?: string;
  /** Override rendered icon size in px (defaults to 20) */
  iconSize?: number;
  /** Hide the text label on desktop, showing only the icon */
  hideLabel?: boolean;
  /** Vertical offset in px applied to the icon (positive = down) */
  iconOffset?: number;
}

const ICON_COLOR = "6B7A99";
const ICON_SIZE = 20;
const ROTATE_MS = 2500;

const defaultTechnologies: TechItem[] = [
  { name: "TypeScript", slug: "typescript" },
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "PostgreSQL", slug: "postgresql" },
  {
    name: "AWS",
    slug: "amazonaws",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg",
    iconSize: 27,
    iconOffset: 3,
  },
  { name: "Supabase", slug: "supabase" },
  { name: "Docker", slug: "docker" },
  { name: "Cloudflare", slug: "cloudflare" },
  { name: "Vercel", slug: "vercel" },
  { name: "Nx", slug: "nx" },
];

function TechIcon({
  tech,
  size = ICON_SIZE,
}: {
  tech: TechItem;
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={tech.src ?? `https://cdn.simpleicons.org/${tech.slug}/${ICON_COLOR}`}
      width={size}
      height={size}
      alt=""
      aria-hidden
      style={{
        display: "block",
        flexShrink: 0,
        filter: tech.src
          ? "grayscale(1) brightness(0.5) invert(1) brightness(0.55)"
          : undefined,
        marginTop: tech.iconOffset ?? 0,
      }}
    />
  );
}

// Isolated leaf — interval state never triggers parent re-renders
const MobileRotatingBanner = memo(function MobileRotatingBanner({
  technologies,
}: {
  technologies: TechItem[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % technologies.length),
      ROTATE_MS,
    );
    return () => clearInterval(id);
  }, [technologies.length]);

  const tech = technologies[index];

  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        mt: 2.5,
      }}
    >
      <Typography
        component="p"
        sx={{
          fontSize: "0.625rem",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "text.secondary",
          opacity: 0.4,
          lineHeight: 1,
        }}
      >
        Technologies I frequently work with
      </Typography>

      {/* Fixed-height viewport prevents layout shift during transitions */}
      <Box
        sx={{
          position: "relative",
          height: 32,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <MotionBox
            key={tech.slug}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            sx={{
              position: "absolute",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <TechIcon tech={tech} />
            {/* Always show label on mobile — icon alone is ambiguous at 20px */}
            <Typography
              component="span"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                letterSpacing: "0.01em",
                color: "text.primary",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {tech.name}
            </Typography>
          </MotionBox>
        </AnimatePresence>
      </Box>
    </Box>
  );
});

function DesktopBanner({ technologies }: { technologies: TechItem[] }) {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        gap: 1.75,
        mt: 3.5,
      }}
    >
      <Typography
        component="p"
        sx={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "text.secondary",
          opacity: 0.45,
          lineHeight: 1,
        }}
      >
        Technologies I frequently work with
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: { md: 3, lg: 3.5 },
        }}
      >
        {technologies.map((tech, i) => (
          <Box
            key={tech.slug}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              opacity: 0.62,
              transition: "opacity 0.22s ease",
              "&:hover": { opacity: 1 },
              animation: "techFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both",
              animationDelay: `${0.5 + i * 0.07}s`,
              "@keyframes techFadeUp": {
                from: { opacity: 0, transform: "translateY(8px)" },
                to: { opacity: 0.62, transform: "none" },
              },
            }}
          >
            <TechIcon tech={tech} size={tech.iconSize ?? ICON_SIZE} />
            {!tech.hideLabel && (
              <Typography
                component="span"
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  color: "text.primary",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {tech.name}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

interface TechStackBannerProps {
  technologies?: TechItem[];
}

export default function TechStackBanner({
  technologies = defaultTechnologies,
}: TechStackBannerProps) {
  return (
    <>
      <MobileRotatingBanner technologies={technologies} />
      <DesktopBanner technologies={technologies} />
    </>
  );
}
