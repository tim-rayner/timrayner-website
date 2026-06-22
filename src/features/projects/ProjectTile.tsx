"use client";

import { Box, Tooltip, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { Project } from "./data/projects";
import type { ViewMode } from "./ProjectSearch";
import { TileIcon } from "./ProjectIcons";

const MotionBox = motion(Box);

const STATUS_CONFIG = {
  live: { label: "Live", dot: true },
  wip: { label: "In Progress", dot: false },
  concept: { label: "Concept", dot: false },
} as const;

export interface ProjectTileProps {
  project: Project;
  colorOverride?: string;
  accentColor: string;
  index: number;
  viewMode?: ViewMode;
  onContextMenu: (project: Project, x: number, y: number) => void;
  onOpen: (project: Project) => void;
}

export function ProjectTile({
  project,
  colorOverride,
  accentColor,
  index,
  viewMode = "grid",
  onContextMenu,
  onOpen,
}: ProjectTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const visible = useScrollReveal(tileRef as React.RefObject<HTMLElement>, { margin: "-40px" });
  const staggerDelay = Math.min(index * 45, 300);

  const color = colorOverride ?? accentColor;
  const { label: statusLabel, dot } = STATUS_CONFIG[project.status];
  const companyTooltip = project.company
    ? `delivered professionally at ${project.company}`
    : null;

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    onContextMenu(project, e.clientX, e.clientY);
  }

  function handleClick() {
    onOpen(project);
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
      ref={tileRef}
      whileHover={{ y: -2, transition: { type: "spring", stiffness: 300, damping: 28 } }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: viewMode === "list" ? "row" : { xs: "row", sm: "column" },
        alignItems: "center",
        gap: viewMode === "list" ? 1.5 : { xs: 1.5, sm: 1.25 },
        p: viewMode === "list" ? "10px 14px" : { xs: "10px 14px", sm: 2.5 },
        borderRadius: viewMode === "list" ? 1.5 : { xs: 1.5, sm: 2.5 },
        minHeight: viewMode === "list" ? "auto" : { xs: "auto", sm: "160px" },
        border: "1px solid rgba(255,255,255,0.06)",
        bgcolor: "rgba(255,255,255,0.025)",
        cursor: "pointer",
        userSelect: "none",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(14px)",
        transition: `opacity 0.5s ${staggerDelay}ms cubic-bezier(0.22,1,0.36,1), transform 0.5s ${staggerDelay}ms cubic-bezier(0.22,1,0.36,1), border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease`,
        "&:hover": {
          borderColor: `${color}40`,
          bgcolor: `${color}08`,
          boxShadow: `0 8px 24px -8px ${color}22`,
        },
      }}
    >
      {companyTooltip && viewMode !== "list" && (
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

      {/* Folder or company logo - smaller in list view */}
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
          overflow: "hidden",
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
            display: { xs: "none", sm: "block" },
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

      {/* Right-side: star + status grouped so they never overlap */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0, ml: viewMode === "list" ? "auto" : { xs: "auto", sm: 0 } }}>
        {companyTooltip && viewMode === "list" && (
          <Tooltip title={companyTooltip} placement="top" arrow>
            <StarIcon
              aria-label={companyTooltip}
              sx={{ fontSize: 14, color, opacity: 0.85, display: "block" }}
            />
          </Tooltip>
        )}
        {statusBadge}
      </Box>
    </MotionBox>
  );
}
