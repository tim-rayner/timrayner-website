"use client";

import { useState } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";
import type { Project } from "./data/projects";
import type { ViewMode } from "./ProjectSearch";

const MotionBox = motion(Box);

const STATUS_CONFIG = {
  live: { label: "Live", dot: true },
  wip: { label: "In Progress", dot: false },
  concept: { label: "Concept", dot: false },
} as const;

function FolderIcon({ color, size = 56 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * (44 / 56)}
      viewBox="0 0 56 44"
      fill="none"
      aria-hidden="true"
    >
      {/* Folder back */}
      <path
        d="M0 8C0 3.582 3.582 0 8 0H20.343C22.404 0 24.38 0.843 25.808 2.343L27.657 4.333C28.585 5.321 29.856 5.879 31.186 5.879H48C52.418 5.879 56 9.461 56 13.879V36C56 40.418 52.418 44 48 44H8C3.582 44 0 40.418 0 36V8Z"
        fill={color}
        opacity={0.22}
      />
      {/* Folder front face */}
      <path
        d="M0 14C0 11.791 1.791 10 4 10H52C54.209 10 56 11.791 56 14V36C56 40.418 52.418 44 48 44H8C3.582 44 0 40.418 0 36V14Z"
        fill={color}
        opacity={0.55}
      />
      {/* Shine */}
      <path
        d="M4 10H52C54.209 10 56 11.791 56 14V17H0V14C0 11.791 1.791 10 4 10Z"
        fill="white"
        opacity={0.06}
      />
    </svg>
  );
}

function TileIcon({
  logoUrl,
  color,
  size,
}: {
  logoUrl?: string;
  color: string;
  size: 56 | 28;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(logoUrl) && !logoFailed;
  const height = size === 56 ? 44 : 22;

  if (!showLogo) {
    return <FolderIcon color={color} size={size} />;
  }

  return (
    <Box
      sx={{
        width: size,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Box
        component="img"
        src={logoUrl}
        alt=""
        aria-hidden
        onError={() => setLogoFailed(true)}
        sx={{
          display: "block",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />
    </Box>
  );
}

export interface ProjectTileProps {
  project: Project;
  colorOverride?: string;
  accentColor: string;
  index: number;
  viewMode?: ViewMode;
  onContextMenu: (project: Project, x: number, y: number) => void;
}

export function ProjectTile({
  project,
  colorOverride,
  accentColor,
  index,
  viewMode = "grid",
  onContextMenu,
}: ProjectTileProps) {
  const color = colorOverride ?? accentColor;
  const { label: statusLabel, dot } = STATUS_CONFIG[project.status];
  const companyTooltip = project.company
    ? `delivered professionally at ${project.company}`
    : null;

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    onContextMenu(project, e.clientX, e.clientY);
  }

  const statusBadge = (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.6,
        px: 1,
        py: 0.35,
        borderRadius: 0.75,
        bgcolor: `${color}18`,
        border: "1px solid",
        borderColor: `${color}35`,
        flexShrink: 0,
      }}
    >
      {dot && (
        <Box
          aria-hidden
          sx={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            bgcolor: color,
            animation: "statusPulse 2.4s ease-in-out infinite",
            "@keyframes statusPulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.3 },
            },
          }}
        />
      )}
      <Typography
        component="span"
        sx={{
          fontSize: "0.5625rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color,
          lineHeight: 1,
        }}
      >
        {statusLabel}
      </Typography>
    </Box>
  );

  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 22,
        delay: index * 0.05,
      }}
      whileHover={{ y: -2, transition: { type: "spring", stiffness: 300, damping: 28 } }}
      onContextMenu={handleContextMenu}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: viewMode === "list" ? "row" : { xs: "row", sm: "column" },
        alignItems: "center",
        gap: viewMode === "list" ? 1.5 : { xs: 1.5, sm: 1.25 },
        p: viewMode === "list" ? "10px 14px" : { xs: "10px 14px", sm: 2.5 },
        borderRadius: viewMode === "list" ? 1.5 : { xs: 1.5, sm: 2.5 },
        border: "1px solid rgba(255,255,255,0.06)",
        bgcolor: "rgba(255,255,255,0.025)",
        cursor: "pointer",
        userSelect: "none",
        transition: "border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          borderColor: `${color}40`,
          bgcolor: `${color}08`,
          boxShadow: `0 8px 24px -8px ${color}22`,
        },
      }}
    >
      {companyTooltip && (
        <Tooltip title={companyTooltip} placement="top" arrow>
          <StarIcon
            aria-label={companyTooltip}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              fontSize: 14,
              color,
              opacity: 0.85,
            }}
          />
        </Tooltip>
      )}

      {/* Folder or company logo — smaller in list view */}
      <Box sx={{ mt: viewMode === "list" ? 0 : { xs: 0, sm: 0.5 }, flexShrink: 0 }}>
        <Box sx={{ display: viewMode === "list" ? "none" : { xs: "none", sm: "block" } }}>
          <TileIcon logoUrl={project.companyLogoUrl} color={color} size={56} />
        </Box>
        <Box sx={{ display: viewMode === "list" ? "block" : { xs: "block", sm: "none" } }}>
          <TileIcon logoUrl={project.companyLogoUrl} color={color} size={28} />
        </Box>
      </Box>

      {/* Name + tagline */}
      <Box
        sx={{
          textAlign: viewMode === "list" ? "left" : { xs: "left", sm: "center" },
          flex: viewMode === "list" ? 1 : { xs: 1, sm: "unset" },
          width: viewMode === "list" ? "auto" : { xs: "auto", sm: "100%" },
          minWidth: 0,
        }}
      >
        <Typography
          component="p"
          sx={{
            fontSize: { xs: "0.8125rem", sm: "0.875rem" },
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "text.primary",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {project.name}
        </Typography>
        <Typography
          component="p"
          sx={{
            fontSize: "0.6875rem",
            color: "rgba(255,255,255,0.35)",
            lineHeight: 1.3,
            mt: 0.25,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {project.tagline}
        </Typography>
      </Box>

      {/* Status badge — pushed right on mobile */}
      <Box sx={{ ml: { xs: "auto", sm: 0 } }}>{statusBadge}</Box>
    </MotionBox>
  );
}
