"use client";

import {
  Box,
  IconButton,
  Link as MuiLink,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const PHONE_DISPLAY = "07512 282997";
const PHONE_RAW = "07512282997";
const PHONE_TEL = "tel:+447512282997";
const EMAIL = "tim.rayner2020@gmail.com";

const NAV_LINKS = [
  { label: "Projects", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Career", href: "/#career" },
  { label: "Contact", href: "/#contact" },
] as const;

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/tim-rayner",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/tim.raynerr",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@timrcodes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const COMING_SOON_LINKS = [{ label: "Blog", href: "/blog", comingSoon: true }];

function PhoneLink() {
  const isMobile = useMediaQuery("(pointer: coarse)");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(PHONE_RAW);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sharedSx = {
    display: "inline-flex",
    alignItems: "center",
    gap: 1,
    color: "text.secondary",
    fontSize: "0.85rem",
    fontWeight: 450,
    letterSpacing: "0.01em",
    py: 0.5,
    cursor: "pointer",
    background: "none",
    border: "none",
    p: 0,
    fontFamily: "inherit",
    transition: "color 0.2s ease",
    "&:hover": { color: "text.primary" },
  };

  if (isMobile) {
    return (
      <MuiLink href={PHONE_TEL} underline="none" sx={sharedSx}>
        <PhoneIcon />
        {PHONE_DISPLAY}
      </MuiLink>
    );
  }

  return (
    <Box
      component="button"
      onClick={handleCopy}
      aria-label="Copy phone number"
      sx={sharedSx}
    >
      <Box sx={{ position: "relative", width: 12, height: 12, flexShrink: 0 }}>
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                color: "#00D4C4",
              }}
            >
              <CheckIcon />
            </motion.span>
          ) : (
            <motion.span
              key="phone"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <PhoneIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </Box>
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="label-copied"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{ color: "#00D4C4" }}
          >
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="label-number"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {PHONE_DISPLAY}
          </motion.span>
        )}
      </AnimatePresence>
    </Box>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: 0.6 }}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        bgcolor: "background.default",
        pt: { xs: 8, md: 10 },
        pb: { xs: 5, md: 6 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 3, sm: 5, md: 8 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
          gap: { xs: 6, md: 4 },
          alignItems: "start",
        }}
      >
        {/* Left - brand + tagline */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography
              sx={{
                fontSize: "1.15rem",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "text.primary",
              }}
            >
              Tim Rayner
            </Typography>
          </Link>
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "text.secondary",
              maxWidth: 320,
              lineHeight: 1.65,
              letterSpacing: "0.01em",
            }}
          >
            Software engineer building thoughtful products at the intersection
            of AI and great user experience.
          </Typography>

          {/* Social icons */}
          <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <motion.div
                key={label}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <IconButton
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  size="small"
                  sx={{
                    color: "text.secondary",
                    p: 1,
                    borderRadius: 1.5,
                    transition: "color 0.2s ease, background 0.2s ease",
                    "&:hover": {
                      color: "text.primary",
                      bgcolor: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  {icon}
                </IconButton>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Right - navigation columns */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "auto auto" },
            gap: { xs: 4, sm: 8 },
            alignItems: "start",
          }}
        >
          {/* Site links */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "text.disabled",
                mb: 1.5,
              }}
            >
              Navigate
            </Typography>
            {NAV_LINKS.map(({ label, href }) => (
              <MuiLink
                key={href}
                href={href}
                underline="none"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.85rem",
                  fontWeight: 450,
                  letterSpacing: "0.01em",
                  py: 0.5,
                  transition: "color 0.2s ease",
                  "&:hover": { color: "text.primary" },
                }}
              >
                {label}
              </MuiLink>
            ))}
            {COMING_SOON_LINKS.map(({ label, href }) => (
              <Box
                key={href}
                sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5 }}
              >
                <MuiLink
                  href={href}
                  underline="none"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.85rem",
                    fontWeight: 450,
                    letterSpacing: "0.01em",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "text.primary" },
                  }}
                >
                  {label}
                </MuiLink>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "primary.main",
                    bgcolor: "rgba(124,93,255,0.12)",
                    px: 0.75,
                    py: "2px",
                    borderRadius: 0.75,
                    lineHeight: 1.6,
                    border: "1px solid rgba(124,93,255,0.2)",
                  }}
                >
                  Soon
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Resources */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "text.disabled",
                mb: 1.5,
              }}
            >
              Resources
            </Typography>
            <MuiLink
              component="a"
              href="/assets/pdf/2026-TR-CV.pdf"
              download
              underline="none"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                color: "text.secondary",
                fontSize: "0.85rem",
                fontWeight: 450,
                letterSpacing: "0.01em",
                py: 0.5,
                transition: "color 0.2s ease",
                "&:hover": { color: "text.primary" },
              }}
            >
              Download CV
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.6 }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </MuiLink>
            <MuiLink
              href={`mailto:${EMAIL}`}
              underline="none"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                color: "text.secondary",
                fontSize: "0.85rem",
                fontWeight: 450,
                letterSpacing: "0.01em",
                py: 0.5,
                transition: "color 0.2s ease",
                "&:hover": { color: "text.primary" },
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.6 }}
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              {EMAIL}
            </MuiLink>
            <PhoneLink />
          </Box>
        </Box>
      </Box>

      {/* Bottom bar */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 3, sm: 5, md: 8 },
          mt: { xs: 6, md: 8 },
          pt: 3,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "text.disabled",
            letterSpacing: "0.01em",
          }}
        >
          {year} Tim Rayner. All rights reserved.
        </Typography>
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "text.disabled",
            letterSpacing: "0.01em",
          }}
        >
          Built with ❤️ and 🤖 by Tim Rayner
        </Typography>
      </Box>
    </Box>
  );
}
