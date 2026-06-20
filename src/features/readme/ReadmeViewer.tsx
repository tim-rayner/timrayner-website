"use client";

import { Box, Typography } from "@mui/material";
import { useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const PRINCIPLES = [
  {
    title: "User Experience First",
    description:
      "Software succeeds when it solves real problems and feels effortless to use.",
  },
  {
    title: "Strongly Typed by Default",
    description:
      "I favour TypeScript, schema validation and end-to-end type safety to catch problems before they reach production.",
  },
  {
    title: "Security & Reliability",
    description:
      "Authentication, authorisation and data protection are considered from day one, not added later.",
  },
  {
    title: "Performance Matters",
    description:
      "Fast software creates trust. I optimise for responsiveness, scalability and efficient system design.",
  },
  {
    title: "Pragmatic Architecture",
    description:
      "I start simple, validate early and introduce complexity only when it is justified by real requirements.",
  },
  {
    title: "Continuous Learning",
    description:
      "Self-taught and constantly evolving, from frontend engineering and cloud infrastructure to AI and offline-first systems.",
  },
];

const MONO =
  '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace';

function FileIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 16 16"
      aria-hidden
      sx={{ width: 14, height: 14, flexShrink: 0, color: "text.disabled" }}
    >
      <path
        fill="currentColor"
        d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"
      />
    </Box>
  );
}

function CheckIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 16 16"
      aria-hidden
      sx={{ width: 14, height: 14, flexShrink: 0, color: "success.main" }}
    >
      <path
        fill="currentColor"
        d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
      />
    </Box>
  );
}

export function ReadmeViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const visible = useScrollReveal(containerRef, { margin: "-80px" });

  return (
    <Box
      component="section"
      id="about"
      aria-label="How I Build Software"
      sx={{
        py: { xs: 8, md: 11 },
        scrollMarginTop: { xs: "56px", md: "64px" },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box
          ref={containerRef}
          sx={{
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 2,
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(28px)",
            transition:
              "opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* File header bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: { xs: 2.5, md: 3 },
              py: 1.375,
              bgcolor: "rgba(0, 0, 0, 0.28)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              gap: 1,
            }}
          >
            <FileIcon />
            <Typography
              component="span"
              sx={{
                fontFamily: MONO,
                fontSize: "0.75rem",
                color: "secondary.main",
                lineHeight: 1,
              }}
            >
              timrayner
            </Typography>
            <Typography
              component="span"
              sx={{
                fontFamily: MONO,
                fontSize: "0.75rem",
                color: "text.disabled",
                lineHeight: 1,
              }}
            >
              /
            </Typography>
            <Typography
              component="span"
              sx={{
                fontFamily: MONO,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "text.primary",
                lineHeight: 1,
              }}
            >
              README.md
            </Typography>
          </Box>

          {/* README body */}
          <Box
            sx={{
              bgcolor: "background.paper",
              px: { xs: 3, sm: 4.5, md: 6 },
              py: { xs: 4, md: 5 },
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.5rem", md: "1.75rem" },
                fontWeight: 700,
                letterSpacing: "-0.022em",
                lineHeight: 1.25,
                color: "text.primary",
                pb: 1.5,
                mb: 2,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              How I Build Software
            </Typography>

            <Typography
              component="p"
              sx={{
                fontSize: { xs: "0.92rem", md: "0.95rem" },
                lineHeight: 1.8,
                color: "text.secondary",
                mb: 3,
                maxWidth: "68ch",
              }}
            >
              Over 7+ years building products across startups, SaaS and
              enterprise teams, these are the principles that consistently shape
              my work.
            </Typography>

            <Box
              component="hr"
              sx={{
                border: "none",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                mb: 3,
              }}
            />

            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {PRINCIPLES.map((principle, i) => (
                <Box
                  component="li"
                  key={principle.title}
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                    py: 1.875,
                    borderBottom:
                      i < PRINCIPLES.length - 1
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "none",
                    transition:
                      "transform 0.18s cubic-bezier(0.22,1,0.36,1)",
                    "&:hover": {
                      transform: "translateX(4px)",
                      "& .principle-title": {
                        color: "text.primary",
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      mt: "3px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    <CheckIcon />
                  </Box>
                  <Box>
                    <Typography
                      className="principle-title"
                      component="span"
                      sx={{
                        display: "block",
                        fontSize: { xs: "0.9rem", md: "0.9375rem" },
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.82)",
                        mb: 0.375,
                        lineHeight: 1.4,
                        transition: "color 0.18s",
                      }}
                    >
                      {principle.title}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        display: "block",
                        fontSize: { xs: "0.84rem", md: "0.875rem" },
                        lineHeight: 1.7,
                        color: "text.secondary",
                      }}
                    >
                      {principle.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
