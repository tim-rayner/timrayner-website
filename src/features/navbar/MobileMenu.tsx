"use client";

import { Box, Button, Link as MuiLink } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

interface NavLink {
  readonly label: string;
  readonly href: string;
}

interface MobileMenuProps {
  open: boolean;
  links: readonly NavLink[];
  onClose: () => void;
}

const containerVariants = {
  closed: {
    height: 0,
    transition: {
      height: { type: "spring" as const, stiffness: 400, damping: 40 },
      when: "afterChildren",
    },
  },
  open: {
    height: "auto",
    transition: {
      height: { type: "spring" as const, stiffness: 400, damping: 40 },
      staggerChildren: 0.055,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  closed: { y: -10, opacity: 0 },
  open: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 320, damping: 30 },
  },
};

export default function MobileMenu({ open, links, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          variants={containerVariants}
          initial="closed"
          animate="open"
          exit="closed"
          style={{ overflow: "hidden" }}
        >
          <Box
            sx={{
              px: 3,
              pt: 1.5,
              pb: 3,
              display: "flex",
              flexDirection: "column",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {links.map(({ label, href }) => (
              <motion.div key={href} variants={itemVariants}>
                <MuiLink
                  href={href}
                  underline="none"
                  onClick={onClose}
                  sx={{
                    display: "block",
                    py: 1.5,
                    color: "text.secondary",
                    fontSize: "1rem",
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "text.primary" },
                    "&:last-of-type": { borderBottom: "none" },
                  }}
                >
                  {label}
                </MuiLink>
              </motion.div>
            ))}

            <motion.div variants={itemVariants}>
              <Button
                component="a"
                href="/assets/pdf/2026-TR-CV.pdf"
                download
                fullWidth
                onClick={onClose}
                sx={{
                  mt: 2.5,
                  bgcolor: "cta.main",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  letterSpacing: "0.04em",
                  py: 1.25,
                  borderRadius: 1.5,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                  transition: "filter 0.2s ease, transform 0.1s ease",
                  "&:hover": {
                    bgcolor: "cta.main",
                    filter: "brightness(1.12)",
                  },
                  "&:active": { transform: "scale(0.98)" },
                }}
              >
                Download CV
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
