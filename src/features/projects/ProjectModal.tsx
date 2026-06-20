"use client";

import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";
import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { motion } from "framer-motion";
import type { Project } from "./data/projects";
import { TileIcon, NpmLogo, ChromeLogo } from "./ProjectIcons";

const MotionBox = motion(Box);

const STATUS_CONFIG = {
  live: { label: "Live", pulsing: true },
  wip: { label: "In Progress", pulsing: false },
  concept: { label: "Concept", pulsing: false },
} as const;

function LinkButton({
  href,
  icon,
  label,
  accentColor,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  accentColor: string;
}) {
  return (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.875,
        px: 2,
        py: 1,
        borderRadius: 1.5,
        border: "1px solid rgba(255,255,255,0.12)",
        bgcolor: "rgba(255,255,255,0.04)",
        color: "rgba(255,255,255,0.7)",
        textDecoration: "none",
        fontSize: "0.8125rem",
        fontWeight: 500,
        letterSpacing: "0.01em",
        lineHeight: 1,
        transition: "all 0.18s ease",
        "& svg": { fontSize: 15 },
        "&:hover": {
          bgcolor: `${accentColor}20`,
          borderColor: `${accentColor}55`,
          color: accentColor,
        },
        "&:active": { transform: "scale(0.97)" },
      }}
    >
      {icon}
      {label}
    </Box>
  );
}

export interface ProjectModalProps {
  project: Project;
  accentColor: string;
  onClose: () => void;
}

export function ProjectModal({ project, accentColor, onClose }: ProjectModalProps) {
  const { label: statusLabel, pulsing } = STATUS_CONFIG[project.status];

  const hasLinks =
    !!project.websiteUrl ||
    !!project.githubHref ||
    !!project.npmUrl ||
    !!project.extensionHref ||
    !!project.href;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 4 },
      }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(5, 7, 14, 0.80)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 620,
          maxHeight: "90dvh",
          overflowY: "auto",
        }}
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
      >
        <Box
          sx={{
            bgcolor: "rgba(14, 18, 30, 0.96)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow:
              "0 48px 96px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          {/* ── Header ── */}
          <Box
            sx={{
              position: "relative",
              p: { xs: "28px 24px 24px", sm: "36px 36px 28px" },
              overflow: "hidden",
            }}
          >
            {/* Ambient colour wash */}
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse 80% 140% at 10% -20%, ${accentColor}26 0%, transparent 60%)`,
                pointerEvents: "none",
              }}
            />

            {/* Close button */}
            <Box
              component="button"
              aria-label="Close"
              onClick={onClose}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 30,
                height: 30,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 1,
                transition: "background-color 0.15s ease",
                "&:hover": { bgcolor: "rgba(255,255,255,0.14)" },
                "&:active": { transform: "scale(0.93)" },
              }}
            >
              <CloseIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.55)" }} />
            </Box>

            {/* Icon + meta */}
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: { xs: 2.5, sm: 3 } }}>
              {/* Icon */}
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.05 }}
                sx={{ flexShrink: 0, mt: 0.5 }}
              >
                <TileIcon logoUrl={project.companyLogoUrl} color={accentColor} size={72} />
              </MotionBox>

              {/* Text meta */}
              <Box sx={{ flex: 1, minWidth: 0, pt: 0.5 }}>
                <MotionBox
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.1 }}
                >
                  <Typography
                    component="h2"
                    sx={{
                      fontSize: { xs: "1.5rem", sm: "1.75rem" },
                      fontWeight: 700,
                      letterSpacing: "-0.035em",
                      lineHeight: 1.1,
                      color: "text.primary",
                      pr: 4,
                    }}
                  >
                    {project.name}
                  </Typography>
                </MotionBox>

                <MotionBox
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.16 }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.9375rem",
                      color: "rgba(255,255,255,0.42)",
                      mt: 0.75,
                      lineHeight: 1.4,
                    }}
                  >
                    {project.tagline}
                  </Typography>
                </MotionBox>

                {/* Badges */}
                <MotionBox
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.22 }}
                  sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap", alignItems: "center" }}
                >
                  {/* Status */}
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.65,
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: `${accentColor}18`,
                      border: "1px solid",
                      borderColor: `${accentColor}38`,
                    }}
                  >
                    {pulsing && (
                      <Box
                        aria-hidden
                        sx={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          bgcolor: accentColor,
                          animation: "modalDot 2.4s ease-in-out infinite",
                          "@keyframes modalDot": {
                            "0%, 100%": { opacity: 1 },
                            "50%": { opacity: 0.25 },
                          },
                        }}
                      />
                    )}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "0.5625rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: accentColor,
                        lineHeight: 1,
                      }}
                    >
                      {statusLabel}
                    </Typography>
                  </Box>

                  {/* Company */}
                  {project.company && (
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {project.companyLogoUrl && (
                        <Box
                          component="img"
                          src={project.companyLogoUrl}
                          alt=""
                          aria-hidden
                          sx={{ width: 13, height: 13, objectFit: "contain" }}
                        />
                      )}
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "0.5625rem",
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.38)",
                          lineHeight: 1,
                        }}
                      >
                        {project.company}
                      </Typography>
                    </Box>
                  )}
                </MotionBox>
              </Box>
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.07)" }} />

          {/* ── Body ── */}
          <MotionBox
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.28 }}
            sx={{ p: { xs: "24px", sm: "28px 36px" } }}
          >
            <Typography
              sx={{
                fontSize: "0.5625rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: accentColor,
                mb: 1.5,
                opacity: 0.85,
              }}
            >
              About
            </Typography>
            <Typography
              sx={{
                fontSize: "0.9375rem",
                lineHeight: 1.82,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {project.description}
            </Typography>
          </MotionBox>

          {/* ── Footer links ── */}
          {hasLinks && (
            <>
              <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.07)" }} />
              <MotionBox
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.36 }}
                sx={{
                  p: { xs: "18px 24px", sm: "20px 36px" },
                  display: "flex",
                  gap: 1.25,
                  flexWrap: "wrap",
                }}
              >
                {project.websiteUrl && (
                  <LinkButton
                    href={project.websiteUrl}
                    icon={<LanguageIcon />}
                    label="Visit website"
                    accentColor={accentColor}
                  />
                )}
                {project.href && (
                  <LinkButton
                    href={project.href}
                    icon={<OpenInNewIcon />}
                    label="Open project"
                    accentColor={accentColor}
                  />
                )}
                {project.githubHref && (
                  <LinkButton
                    href={project.githubHref}
                    icon={<GitHubIcon />}
                    label="GitHub"
                    accentColor={accentColor}
                  />
                )}
                {project.npmUrl && (
                  <LinkButton
                    href={project.npmUrl}
                    icon={<NpmLogo size={15} />}
                    label="npm"
                    accentColor={accentColor}
                  />
                )}
                {project.extensionHref && (
                  <LinkButton
                    href={project.extensionHref}
                    icon={<ChromeLogo size={15} />}
                    label="Chrome extension"
                    accentColor={accentColor}
                  />
                )}
              </MotionBox>
            </>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}
