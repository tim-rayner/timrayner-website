"use client";

import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, Button, Chip, IconButton, Typography } from "@mui/material";
import { motion } from "framer-motion";
import TechStackBanner from "./TechStackBanner";
import Image from "next/image";

const MotionBox = motion(Box);

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 20 },
  },
};

const imageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" as const, delay: 0.15 },
  },
};

export default function HeroSection() {
  return (
    <Box
      component="section"
      aria-label="Hero"
      sx={{
        minHeight: "100dvh",
        bgcolor: "background.default",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "55fr 45fr" },
        gridTemplateRows: { xs: "38dvh auto", md: "1fr" },
      }}
    >
      {/* Mobile only: full-width image strip at top */}
      <MotionBox
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        sx={{
          display: { xs: "block", md: "none" },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Image
          src="/tim-background.PNG"
          alt="Tim Rayner"
          fill
          priority
          onContextMenu={(e) => e.preventDefault()}
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center 32%",
          }}
        />
        {/* Bottom fade into background */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 50%, #0B0F1A 100%)",
            pointerEvents: "none",
          }}
        />
      </MotionBox>

      {/* Content */}
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: { xs: "center", md: "flex-start" },
          textAlign: { xs: "center", md: "left" },
          width: "100%",
          px: { xs: 3, sm: 5, md: 8 },
          pt: { xs: 3, md: "calc(64px + 12px)" },
          pb: { xs: 6, md: 10 },
        }}
      >
        {/* Name block */}
        <MotionBox
          variants={itemVariants}
          sx={{ mb: { xs: 0.5, md: 0.5 }, width: "100%" }}
        >
          {/* Eyebrow */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: { xs: "center", md: "flex-start" },
              flexWrap: "wrap",
              gap: 1.25,
              mb: { xs: 1, md: 1.5 },
            }}
          >
            <Chip
              icon={
                <Box
                  component="span"
                  aria-hidden
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "success.main",
                    boxShadow: "0 0 0 2px rgba(0, 212, 196, 0.25)",
                    animation: "availabilityPulse 2.4s ease-in-out infinite",
                  }}
                />
              }
              label="Available for new opportunities"
              size="small"
              sx={{
                height: 26,
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                bgcolor: "rgba(0, 212, 196, 0.1)",
                color: "success.main",
                border: "1px solid",
                borderColor: "rgba(0, 212, 196, 0.35)",
                borderRadius: 1,
                "& .MuiChip-icon": {
                  ml: 1,
                  mr: -0.25,
                },
                "& .MuiChip-label": { px: 1.25 },
                "@keyframes availabilityPulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.45 },
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.4,
                color: "text.secondary",
              }}
            >
              <PlaceIcon sx={{ fontSize: "0.875rem", opacity: 0.7 }} />
              <Typography
                component="span"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Norwich, UK
              </Typography>
            </Box>
          </Box>

          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: "2.2rem",
                sm: "2.6rem",
                md: "2.9rem",
                lg: "3.5rem",
              },
              fontWeight: { xs: 800, md: 300 },
              lineHeight: 1.05,
              letterSpacing: { xs: "-0.03em", md: "-0.02em" },
              color: "text.primary",
            }}
          >
            Tim Rayner
          </Typography>
        </MotionBox>

        {/* Role */}
        <MotionBox variants={itemVariants} sx={{ mb: { xs: 1.5, md: 1.5 } }}>
          <Typography
            component="p"
            sx={{
              fontSize: { xs: "1.05rem", md: "1.1rem" },
              fontWeight: 500,
              letterSpacing: "0.01em",
              color: "text.primary",
              opacity: 0.7,
              lineHeight: 1.3,
            }}
          >
            Full-Stack Software Engineer
          </Typography>
        </MotionBox>

        {/* Supporting copy — mobile only */}
        <MotionBox
          variants={itemVariants}
          sx={{ mb: { xs: 2, md: 0 }, width: "100%", display: { xs: "block", md: "none" } }}
        >
          <Typography
            sx={{
              color: "text.secondary",
              lineHeight: 1.75,
              fontSize: "1rem",
              maxWidth: "44ch",
            }}
          >
            Self-taught engineer with 7+ years of experience designing and
            delivering production software at scale.
          </Typography>
        </MotionBox>

        {/* Tagline — hidden on mobile */}
        <MotionBox
          variants={itemVariants}
          sx={{ mb: { xs: 2, md: 1 }, display: { xs: "none", sm: "block" } }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: {
                xs: "1.75rem",
                sm: "2.6rem",
                md: "2.8rem",
                lg: "3.2rem",
              },
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: "text.primary",
            }}
          >
            Self Taught
            <br />
            <Box component="span" sx={{ color: "primary.main" }}>
              Production Tested
            </Box>
          </Typography>
        </MotionBox>

        {/* CTA block */}
        <MotionBox
          variants={itemVariants}
          sx={{ width: "100%", mt: { xs: 0, sm: 0 } }}
        >
          {/* Mobile: View Work full-width; secondary row below */}
          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Button
              component="a"
              href="#work"
              variant="contained"
              color="cta"
              fullWidth
              sx={{
                height: 44,
                fontWeight: 700,
                fontSize: "0.875rem",
                borderRadius: 1.5,
                letterSpacing: "0.01em",
              }}
            >
              View My Work
            </Button>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                component="a"
                href="/assets/pdf/2025-TR-CV.pdf"
                download
                variant="outlined"
                fullWidth
                sx={{
                  height: 44,
                  borderColor: "rgba(255,255,255,0.18)",
                  color: "text.primary",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  borderRadius: 1.5,
                  transition: "border-color 0.2s ease, color 0.2s ease",
                  "&:hover": {
                    borderColor: "cta.main",
                    color: "cta.main",
                    bgcolor: "transparent",
                  },
                }}
              >
                Download CV
              </Button>
              <IconButton
                component="a"
                href="https://www.linkedin.com/in/tim-rayner/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View LinkedIn profile"
                sx={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  border: "1px solid",
                  borderColor: "#FFFFFF",
                  borderRadius: 1.5,
                  color: "#FFFFFF",
                  transition: "background-color 0.2s ease",
                  "&:hover": { bgcolor: "primary.main", borderColor: "primary.main" },
                }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* sm+: original single-row layout */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              gap: 1.5,
              alignItems: "center",
              justifyContent: { sm: "center", md: "flex-start" },
            }}
          >
            <Button
              component="a"
              href="#work"
              variant="contained"
              color="cta"
              sx={{
                height: 42,
                px: 3,
                fontWeight: 700,
                fontSize: "0.875rem",
                borderRadius: 1.5,
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
              }}
            >
              View My Work
            </Button>
            <Button
              component="a"
              href="/assets/pdf/2025-TR-CV.pdf"
              download
              variant="outlined"
              sx={{
                height: 42,
                px: 3,
                borderColor: "rgba(255,255,255,0.18)",
                color: "text.primary",
                fontSize: "0.875rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                borderRadius: 1.5,
                whiteSpace: "nowrap",
                transition: "border-color 0.2s ease, color 0.2s ease",
                "&:hover": {
                  borderColor: "cta.main",
                  color: "cta.main",
                  bgcolor: "transparent",
                },
              }}
            >
              Download CV
            </Button>
            <IconButton
              component="a"
              href="https://www.linkedin.com/in/tim-rayner/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View LinkedIn profile"
              sx={{
                width: 42,
                height: 42,
                flexShrink: 0,
                border: "1px solid",
                borderColor: "#FFFFFF",
                borderRadius: 1.5,
                color: "#FFFFFF",
                transition: "background-color 0.2s ease",
                "&:hover": { bgcolor: "primary.main", borderColor: "primary.main" },
              }}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Box>
        </MotionBox>

        {/* Tech stack banner — desktop only */}
        <MotionBox variants={itemVariants}>
          <TechStackBanner />
        </MotionBox>
      </MotionBox>

      {/* Desktop only: full-height image on right */}
      <MotionBox
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        sx={{
          display: { xs: "none", md: "block" },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Image
          src="/tim-background.PNG"
          alt=""
          fill
          priority
          onContextMenu={(e) => e.preventDefault()}
          sizes="45vw"
          style={{
            objectFit: "cover",
            objectPosition: "center calc(50% + 150px)",
          }}
        />
        {/* Horizontal left-edge fade into content */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            width: 180,
            background:
              "linear-gradient(to right, #0B0F1A 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      </MotionBox>
    </Box>
  );
}
