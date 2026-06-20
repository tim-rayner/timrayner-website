"use client";

import { Box, Typography } from "@mui/material";
import { ProjectsGrid } from "./ProjectsGrid";
import { RightClickHint } from "./RightClickHint";

export function ProjectsSection() {
  return (
    <Box
      component="section"
      id="projects"
      aria-label="Projects"
      sx={{
        py: { xs: 8, md: 11 },
        scrollMarginTop: { xs: "56px", md: "64px" },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Section header */}
        <Box
          sx={{
            mb: { xs: 5, md: 7 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 2.5, md: 4 },
            alignItems: "center",
          }}
        >
          <Box>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 1.5,
                  py: 0.6,
                  borderRadius: 1,
                  border: "1px solid rgba(124, 93, 255, 0.3)",
                  bgcolor: "rgba(124, 93, 255, 0.08)",
                }}
              >
                <Box
                  component="span"
                  aria-hidden
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                  }}
                />
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "primary.main",
                    lineHeight: 1,
                  }}
                >
                  Selected Work
                </Typography>
              </Box>
            </Box>

            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "2.4rem", sm: "3rem", md: "3.5rem" },
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
                color: "text.primary",
              }}
            >
              Projects
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.95rem", md: "1rem" },
              lineHeight: 1.8,
              maxWidth: "44ch",
            }}
          >
            A collection of my most meaningful work. Things I built because the
            problem was interesting, the craft mattered, or both. Spans personal
            side projects, open source, and notable work delivered
            professionally.
          </Typography>
        </Box>

        {/* Subheading above the grid */}
        <Typography
          component="h3"
          sx={{
            mb: 3,
            fontFamily: "var(--font-caveat)",
            fontSize: { xs: "1.35rem", md: "1.55rem" },
            fontWeight: 600,
            color: "text.disabled",
            letterSpacing: "0.01em",
          }}
        >
          Click a project to learn more!
        </Typography>

        {/* Drive-style projects grid — relative wrapper anchors the doodle hint */}
        <Box sx={{ position: "relative" }}>
          <RightClickHint />
          <ProjectsGrid />
        </Box>

        <Typography
          sx={{
            mt: 6,
            mb: 2,
            fontFamily: "var(--font-caveat)",
            fontSize: { xs: "1.1rem", md: "1.5rem" },
            fontWeight: 500,
            color: "text.disabled",
            textAlign: "center",
            lineHeight: 1.7,
          }}
        >
          If a project doesn&apos;t allow login or isn&apos;t working, please{" "}
          <Box
            component="a"
            href="mailto:tim.rayner2020@gmail.com"
            sx={{
              color: "inherit",
              textDecoration: "underline",
              textDecorationColor: "inherit",
            }}
          >
            contact me
          </Box>{" "}
          and I&apos;ll spin the servers back up for you.
        </Typography>
      </Box>
    </Box>
  );
}
