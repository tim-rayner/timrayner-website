"use client";

import { useEffect, useRef } from "react";
import { Box, Divider, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LanguageIcon from "@mui/icons-material/Language";
import GitHubIcon from "@mui/icons-material/GitHub";
import type { Project } from "./data/projects";
import { NpmLogo, ChromeLogo } from "./ProjectIcons";

const TILE_COLORS = [
  { label: "Purple", value: "#7C5DFF" },
  { label: "Blue", value: "#4D8EFF" },
  { label: "Teal", value: "#00D4C4" },
  { label: "Lilac", value: "#B39DFF" },
  { label: "Rose", value: "#E0607A" },
  { label: "Amber", value: "#F59E0B" },
  { label: "Slate", value: "#94A3B8" },
  { label: "Emerald", value: "#34D399" },
];

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

function MenuRow({ icon, label, onClick, danger }: MenuItem) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        width: "100%",
        px: 1.5,
        py: 0.875,
        border: "none",
        bgcolor: "transparent",
        color: danger ? "#E0607A" : "rgba(255,255,255,0.75)",
        cursor: "pointer",
        borderRadius: 1,
        fontSize: "0.8125rem",
        fontWeight: 400,
        letterSpacing: "0.01em",
        textAlign: "left",
        transition: "background-color 0.12s ease, color 0.12s ease",
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.07)",
          color: danger ? "#FF8FA3" : "rgba(255,255,255,0.95)",
        },
        "& svg": { fontSize: 15, opacity: 0.7 },
      }}
    >
      {icon}
      <Typography
        component="span"
        sx={{
          fontSize: "inherit",
          fontWeight: "inherit",
          color: "inherit",
          letterSpacing: "inherit",
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export interface ProjectContextMenuProps {
  project: Project;
  position: { x: number; y: number };
  activeColor: string;
  onClose: () => void;
  onColorChange: (projectId: string, color: string) => void;
}

export function ProjectContextMenu({
  project,
  position,
  activeColor,
  onClose,
  onColorChange,
}: ProjectContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  // Clamp to viewport
  const menuWidth = 220;
  const menuHeight = 240;
  const x = Math.min(position.x, window.innerWidth - menuWidth - 12);
  const y = Math.min(position.y, window.innerHeight - menuHeight - 12);

  const items: MenuItem[] = [
    {
      icon: <ContentCopyIcon />,
      label: "Copy link",
      onClick: () => {
        const url =
          project.websiteUrl ??
          project.href ??
          `${window.location.origin}#${project.id}`;
        navigator.clipboard.writeText(url);
        onClose();
      },
    },
    ...(project.websiteUrl
      ? [
          {
            icon: <LanguageIcon />,
            label: "Visit website",
            onClick: () => {
              window.open(project.websiteUrl, "_blank", "noopener");
              onClose();
            },
          },
        ]
      : []),
    ...(project.href
      ? [
          {
            icon: <OpenInNewIcon />,
            label: "Open project",
            onClick: () => {
              window.open(project.href, "_blank", "noopener");
              onClose();
            },
          },
        ]
      : []),
    ...(project.githubHref
      ? [
          {
            icon: <GitHubIcon />,
            label: "GitHub",
            onClick: () => {
              window.open(project.githubHref, "_blank", "noopener");
              onClose();
            },
          },
        ]
      : []),
    ...(project.npmUrl
      ? [
          {
            icon: <NpmLogo />,
            label: "View on npm",
            onClick: () => {
              window.open(project.npmUrl, "_blank", "noopener");
              onClose();
            },
          },
        ]
      : []),
    ...(project.extensionHref
      ? [
          {
            icon: <ChromeLogo />,
            label: "Link to extension",
            onClick: () => {
              window.open(project.extensionHref, "_blank", "noopener");
              onClose();
            },
          },
        ]
      : []),
  ];

  return (
    <Box
      ref={menuRef}
      sx={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 1400,
        width: menuWidth,
        bgcolor: "#1A1F2E",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 2,
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        py: 0.75,
        overflow: "hidden",
      }}
    >
      {/* Action items */}
      <Box sx={{ px: 0.75 }}>
        {items.map((item) => (
          <MenuRow key={item.label} {...item} />
        ))}
      </Box>

      {/* Color picker */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", my: 0.75 }} />
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Typography
          sx={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            mb: 1,
          }}
        >
          Color
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {TILE_COLORS.map(({ label, value }) => {
            const isActive = activeColor === value;
            return (
              <Box
                key={value}
                component="button"
                aria-label={label}
                onClick={() => {
                  onColorChange(project.id, value);
                  onClose();
                }}
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  bgcolor: value,
                  border: isActive
                    ? `2px solid white`
                    : "2px solid transparent",
                  outline: isActive
                    ? `2px solid ${value}`
                    : "2px solid transparent",
                  outlineOffset: 1,
                  cursor: "pointer",
                  p: 0,
                  transition: "transform 0.12s ease",
                  "&:hover": { transform: "scale(1.2)" },
                  "&:active": { transform: "scale(0.95)" },
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
