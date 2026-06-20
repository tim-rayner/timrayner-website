"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Box, Chip, Typography } from "@mui/material";
import Image from "next/image";
import { useRef } from "react";

const ACCENT = {
  secondary: {
    main: "#4D8EFF",
    bg: "rgba(77, 142, 255, 0.07)",
    border: "rgba(77, 142, 255, 0.22)",
    glow: "rgba(77, 142, 255, 0.18)",
  },
  info: {
    main: "#B39DFF",
    bg: "rgba(179, 157, 255, 0.07)",
    border: "rgba(179, 157, 255, 0.22)",
    glow: "rgba(179, 157, 255, 0.18)",
  },
  success: {
    main: "#00D4C4",
    bg: "rgba(0, 212, 196, 0.07)",
    border: "rgba(0, 212, 196, 0.22)",
    glow: "rgba(0, 212, 196, 0.18)",
  },
  primary: {
    main: "#7C5DFF",
    bg: "rgba(124, 93, 255, 0.07)",
    border: "rgba(124, 93, 255, 0.22)",
    glow: "rgba(124, 93, 255, 0.18)",
  },
} as const;

type AccentKey = keyof typeof ACCENT;

const HISTORY = [
  {
    id: "artlist",
    company: "Artlist.io",
    role: "Full Stack Engineer",
    period: "Jan 2025 — Present",
    isCurrent: true,
    logo: "/AL.png",
    logoBg: "#0B0F1A",
    summary:
      "Shipped features across the full stack for Artlist.io - a global creative asset platform used by millions of creators daily. </br> </br> Halfway into my time here I had the oppurtunity to lead the development of the Artlist AI Toolkit alongisde my colleague. We built the foundtations of yet another platform now used by millions of people worldwide, contributing to Artlist's 300m ARR growth.",
    tags: [
      "Next.js",
      "Nest.js",
      "tRPC",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "AWS",
      "Docker",
    ],
    accentKey: "primary" as AccentKey,
  },
  {
    id: "mobilityways",
    company: "Mobilityways",
    role: "Frontend Developer",
    period: "Aug 2022 — Dec 2024",
    isCurrent: false,
    logo: "https://media.licdn.com/dms/image/v2/C4E0BAQFeeZ02QCGz8w/company-logo_200_200/company-logo_200_200/0/1663758987311/mobilityways_logo?e=2147483647&v=beta&t=YXPRfzJm1fNrrWiOh5FTAgGs8ZWaF4NVPAMp_k3373Q",
    summary:
      "Sharpened frontend craft across Vue 3, React Native, and legacy templating systems. Built a reputation for precision-grade UI delivery and helped redefine the companies B2B digital strategy.",
    tags: [
      "Vue 3",
      "React Native",
      "TypeScript",
      "Pinia",
      "Node.js",
      "SASS",
      "Azure",
    ],
    accentKey: "success" as AccentKey,
  },
  {
    id: "asprey",
    company: "Asprey Management Solutions",
    role: "Full Stack Developer",
    period: "Mar 2022 — Aug 2022",
    isCurrent: false,
    logo: "https://media.licdn.com/dms/image/v2/C4D0BAQGL03XRqjCXnA/company-logo_100_100/company-logo_100_100/0/1630495261709/asprey_management_solutions_logo?e=2147483647&v=beta&t=ZWeGpTGW1m8ypSioRlEtbDwjnV1-4FtDZm9o2d3OuAw",
    summary:
      "Built cloud-based SPAs and REST APIs for social housing committees. Self-initiated a comprehensive testing overhaul across existing systems — strengthening code quality and team leadership in equal measure.",
    tags: ["Angular", ".NET Core", "C#", "SQL", "Jest"],
    accentKey: "info" as AccentKey,
  },
  {
    id: "crisp",
    company: "Crisp Malt",
    role: "Full Stack Developer",
    period: "Aug 2019 — Mar 2022",
    isCurrent: false,
    logo: "https://media.licdn.com/dms/image/v2/C4E0BAQE0_qXjPmCHSw/company-logo_200_200/company-logo_200_200/0/1630646319463/crisp_malt_logo?e=2147483647&v=beta&t=LVfNRhI1yqvnHMPH5vTwLHUtwVVaOyPzD65xCgxrAY0",
    summary:
      "Where it started. Joined as an apprentice, completed with distinction, and was promoted to frontend developer — migrating legacy/local systems to Microsoft Azure and shipping full-stack solutions across the business.",
    tags: [
      "React",
      "C#",
      ".NET Core",
      "Azure",
      "SQL",
      "Entity Framework",
      "Swift",
    ],
    accentKey: "secondary" as AccentKey,
  },
] as const;

interface EntryCardProps {
  entry: (typeof HISTORY)[number];
  index: number;
}

function EntryCard({ entry, index }: EntryCardProps) {
  const accent = ACCENT[entry.accentKey];
  const cardRef = useRef<HTMLDivElement>(null);
  const visible = useScrollReveal(cardRef as React.RefObject<HTMLElement>, {
    margin: "-60px",
  });
  const delay = index * 80;

  return (
    <Box
      ref={cardRef}
      sx={{
        position: "relative",
        bgcolor: "background.paper",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: `opacity 0.6s ${delay}ms cubic-bezier(0.22,1,0.36,1), transform 0.6s ${delay}ms cubic-bezier(0.22,1,0.36,1)`,
        border: "1px solid",
        borderColor: accent.border,
        borderRadius: 2,
        p: { xs: 2.5, md: 3 },
        overflow: "hidden",
        boxShadow: `0 8px 32px -8px ${accent.glow}`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: accent.main,
          opacity: 0.55,
          pointerEvents: "none",
        },
      }}
    >
      {/* Header row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
          mb: 0.75,
        }}
      >
        <Typography
          component="span"
          sx={{
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "text.secondary",
            opacity: 0.65,
            lineHeight: 1,
            mt: "2px",
          }}
        >
          {entry.period}
        </Typography>

        {entry.isCurrent && (
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.3,
              borderRadius: 0.75,
              bgcolor: "rgba(124, 93, 255, 0.1)",
              border: "1px solid rgba(124, 93, 255, 0.28)",
              flexShrink: 0,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                bgcolor: accent.main,
              }}
            />
            <Typography
              component="span"
              sx={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: accent.main,
                lineHeight: 1,
              }}
            >
              Now
            </Typography>
          </Box>
        )}
      </Box>

      {/* Company */}
      <Typography
        component="h3"
        sx={{
          fontSize: { xs: "1.05rem", md: "1.15rem" },
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: accent.main,
          lineHeight: 1.15,
          mb: 0.3,
        }}
      >
        {entry.company}
      </Typography>

      {/* Role */}
      <Typography
        sx={{
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "text.secondary",
          opacity: 0.6,
          mb: 1.5,
        }}
      >
        {entry.role}
      </Typography>

      {/* Summary */}
      <Typography
        component="div"
        sx={{
          fontSize: "0.875rem",
          color: "text.secondary",
          lineHeight: 1.75,
          mb: 2,
        }}
        dangerouslySetInnerHTML={{ __html: entry.summary }}
      />

      {/* Tags */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
        {entry.tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{
              height: 22,
              fontSize: "0.63rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              bgcolor: accent.bg,
              color: accent.main,
              border: "1px solid",
              borderColor: accent.border,
              borderRadius: 0.75,
              "& .MuiChip-label": { px: 1 },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

interface TimelineItemProps {
  entry: (typeof HISTORY)[number];
  index: number;
}

function TimelineItem({ entry, index }: TimelineItemProps) {
  const isLeft = index % 2 === 0;
  const accent = ACCENT[entry.accentKey];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "52px 1fr", md: "1fr 60px 1fr" },
        mb: { xs: 4, md: 6 },
        alignItems: "start",
      }}
    >
      {/* Left card slot — desktop only */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "flex-end",
          pr: 4.5,
        }}
      >
        {isLeft && <EntryCard entry={entry} index={index} />}
      </Box>

      {/* Logo marker */}
      <Box sx={{ display: "flex", justifyContent: "center", pt: "14px" }}>
        <Box
          sx={{
            width: { xs: 40, md: 44 },
            height: { xs: 40, md: 44 },
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
            bgcolor: "logoBg" in entry ? entry.logoBg : "#fff",
            border: "2px solid",
            borderColor: accent.border,
            boxShadow: `0 0 0 3px rgba(11, 15, 26, 1), 0 0 12px ${accent.glow}`,
          }}
        >
          <Image
            src={entry.logo}
            alt={`${entry.company} logo`}
            fill
            sizes="44px"
            style={{ objectFit: "contain", padding: "4px" }}
          />
        </Box>
      </Box>

      {/* Right card slot */}
      <Box sx={{ pl: { xs: 2.5, md: 4.5 } }}>
        {!isLeft && (
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <EntryCard entry={entry} index={index} />
          </Box>
        )}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <EntryCard entry={entry} index={index} />
        </Box>
      </Box>
    </Box>
  );
}

export default function CareerSnapshot() {
  return (
    <Box
      component="section"
      aria-label="Career Snapshot"
      id="career"
      sx={{
        py: { xs: 8, md: 11 },
        scrollMarginTop: { xs: "56px", md: "64px" },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Section header */}
        <Box sx={{ mb: { xs: 5, md: 7 } }}>
          <Typography
            component="span"
            sx={{
              display: "block",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "primary.main",
              mb: 1.25,
            }}
          >
            Experience
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "2.1rem", md: "2.8rem" },
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "text.primary",
              mb: 1.5,
            }}
          >
            Career Snapshot
          </Typography>
          <Typography
            sx={{
              fontSize: "0.9375rem",
              color: "text.secondary",
              lineHeight: 1.75,
              maxWidth: "46ch",
            }}
          >
            From apprentice to trusted engineer... 7+ years designing, building
            and scaling software across growing teams and products.
          </Typography>
        </Box>

        {/* Timeline */}
        <Box
          sx={{
            position: "relative",
            px: { md: 6 },
          }}
        >
          {/* Spine — mobile */}
          <Box
            aria-hidden
            sx={{
              display: { xs: "block", md: "none" },
              position: "absolute",
              left: 25,
              top: 0,
              bottom: 0,
              width: 2,
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(124, 93, 255, 0.35) 15%, rgba(0, 212, 196, 0.35) 60%, rgba(77, 142, 255, 0.35) 85%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Spine — desktop */}
          <Box
            aria-hidden
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              left: "calc(50% - 1px)",
              top: 0,
              bottom: 0,
              width: 2,
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(124, 93, 255, 0.35) 15%, rgba(0, 212, 196, 0.35) 60%, rgba(77, 142, 255, 0.35) 85%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {HISTORY.map((entry, index) => (
            <TimelineItem key={entry.id} entry={entry} index={index} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
