"use client";

import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const TEASER_LINES = [
  "AI-native engineering patterns.",
  "Decisions from production systems.",
  "What seven years actually taught me.",
  "Building at the intersection of craft and scale.",
  "The parts of software they don't document.",
];

function TypewriterCycle() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "erasing">(
    "typing"
  );

  useEffect(() => {
    const target = TEASER_LINES[index];

    if (phase === "typing") {
      if (displayed.length < target.length) {
        const t = setTimeout(
          () => setDisplayed(target.slice(0, displayed.length + 1)),
          42
        );
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("pausing"), 1900);
      return () => clearTimeout(t);
    }

    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("erasing"), 380);
      return () => clearTimeout(t);
    }

    if (phase === "erasing") {
      if (displayed.length > 0) {
        const t = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          20
        );
        return () => clearTimeout(t);
      }
      setIndex((i) => (i + 1) % TEASER_LINES.length);
      setPhase("typing");
    }
  }, [displayed, phase, index]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "3px", minHeight: "1.6em" }}>
      <Typography
        component="span"
        sx={{
          fontSize: { xs: "0.95rem", md: "1.1rem" },
          color: "text.secondary",
          letterSpacing: "0.005em",
          fontWeight: 400,
          fontStyle: "italic",
        }}
      >
        {displayed}
      </Typography>
      <Box
        component="span"
        sx={{
          display: "inline-block",
          width: "2px",
          height: "1em",
          bgcolor: "primary.main",
          verticalAlign: "middle",
          animation: "cursorBlink 1s step-end infinite",
          "@keyframes cursorBlink": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0 },
          },
        }}
      />
    </Box>
  );
}

export default function BlogClient() {
  return (
    <Box
      component="section"
      aria-label="Blog - coming soon"
      sx={{
        position: "relative",
        minHeight: "100dvh",
        bgcolor: "background.default",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Gradient orbs - decorative background */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: { xs: "-15%", md: "-8%" },
            left: { xs: "-20%", md: "-6%" },
            width: { xs: 420, md: 680 },
            height: { xs: 420, md: 680 },
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,93,255,0.16) 0%, transparent 68%)",
            animation: "orbOne 14s ease-in-out infinite",
            "@keyframes orbOne": {
              "0%, 100%": { transform: "translate(0, 0) scale(1)" },
              "35%": { transform: "translate(44px, 36px) scale(1.06)" },
              "70%": { transform: "translate(-18px, 56px) scale(0.96)" },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: "-20%", md: "-14%" },
            right: { xs: "-18%", md: "-8%" },
            width: { xs: 360, md: 580 },
            height: { xs: 360, md: 580 },
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,212,196,0.1) 0%, transparent 68%)",
            animation: "orbTwo 17s ease-in-out infinite",
            "@keyframes orbTwo": {
              "0%, 100%": { transform: "translate(0, 0) scale(1)" },
              "42%": { transform: "translate(-52px, -36px) scale(1.09)" },
              "72%": { transform: "translate(24px, -58px) scale(0.94)" },
            },
          }}
        />
        {/* Horizontal hairline streak */}
        <Box
          sx={{
            position: "absolute",
            top: "46%",
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(to right, transparent 0%, rgba(124,93,255,0.14) 30%, rgba(0,212,196,0.07) 65%, transparent 100%)",
          }}
        />
      </Box>

      {/* Noise grain overlay */}
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.028,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content - left-aligned */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          px: { xs: 3, sm: 5, md: 8, lg: 12 },
          pt: { xs: 14, md: "calc(64px + 56px)" },
          pb: { xs: 10, md: 12 },
          maxWidth: 1200,
        }}
      >
        {/* Status pill */}
        <Box sx={{ mb: { xs: 4, md: 5 } }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.75,
              borderRadius: 1,
              border: "1px solid rgba(124,93,255,0.22)",
              bgcolor: "rgba(124,93,255,0.07)",
            }}
          >
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                bgcolor: "primary.main",
                animation: "statusPulse 2.3s ease-in-out infinite",
                "@keyframes statusPulse": {
                  "0%, 100%": { opacity: 1, transform: "scale(1)" },
                  "50%": { opacity: 0.35, transform: "scale(0.8)" },
                },
              }}
            />
            <Typography
              sx={{
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "primary.main",
              }}
            >
              Being Written
            </Typography>
          </Box>
        </Box>

        {/* Headline */}
        <Box sx={{ mb: { xs: 2, md: 2.5 } }}>
          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: "5rem",
                sm: "8rem",
                md: "10rem",
                lg: "12rem",
              },
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              color: "text.primary",
            }}
          >
            Blog
          </Typography>
        </Box>

        {/* Divider rule */}
        <Box sx={{ mb: { xs: 3.5, md: 4 } }}>
          <Box
            sx={{
              height: "1px",
              width: { xs: "80%", md: "52%" },
              background:
                "linear-gradient(to right, rgba(255,255,255,0.14) 0%, transparent 100%)",
            }}
          />
        </Box>

        {/* Typewriter line */}
        <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
          <TypewriterCycle />
        </Box>

        {/* Body copy */}
        <Box sx={{ mb: { xs: 5, md: 6 } }}>
          <Typography
            sx={{
              fontSize: { xs: "0.93rem", md: "1.02rem" },
              color: "text.secondary",
              maxWidth: "42ch",
              lineHeight: 1.85,
              letterSpacing: "0.01em",
            }}
          >
            Writing about the things that actually matter in software: the
            tradeoffs, the hard-won lessons, and the patterns worth repeating.
          </Typography>
        </Box>

        {/* Notify badge */}
        <Box>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.5,
              px: 2.5,
              py: 1.25,
              borderRadius: 1.5,
              border: "1px solid rgba(255,255,255,0.09)",
              bgcolor: "rgba(255,255,255,0.025)",
              backdropFilter: "blur(10px)",
              color: "text.secondary",
              fontSize: "0.82rem",
              letterSpacing: "0.02em",
              transition: "border-color 0.25s ease, color 0.25s ease",
              cursor: "default",
              userSelect: "none",
              "&:hover": {
                borderColor: "rgba(124,93,255,0.38)",
                color: "text.primary",
              },
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <Typography
              component="span"
              sx={{ fontSize: "inherit", letterSpacing: "inherit", color: "inherit" }}
            >
              First post dropping soon
            </Typography>
            <Box
              sx={{ width: "1px", height: 14, bgcolor: "rgba(255,255,255,0.1)" }}
            />
            <Typography
              component="span"
              sx={{
                fontSize: "0.72rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              Stay tuned
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Bottom-right metadata */}
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 28, md: 36 },
          right: { xs: 24, md: 52 },
          zIndex: 2,
          textAlign: "right",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.68rem",
            color: "text.disabled",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            lineHeight: 1.9,
          }}
        >
          0 published
          <br />
          something is brewing
        </Typography>
      </Box>
    </Box>
  );
}
