"use client";

import { useState } from "react";
import { AppBar, Box, Button, IconButton, Link as MuiLink, Toolbar } from "@mui/material";
import { motion } from "framer-motion";
import NavBrand from "./NavBrand";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { label: "Projects", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Career", href: "/#career" },
  { label: "Contact", href: "/#contact" },
] as const;

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  const barStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: "1.5px",
    background: "currentColor",
    borderRadius: 2,
  };

  return (
    <Box sx={{ width: 22, height: 16, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "text.primary" }}>
      <motion.span
        animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        style={{ ...barStyle, transformOrigin: "center" }}
      />
      <motion.span
        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.15 }}
        style={barStyle}
      />
      <motion.span
        animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        style={{ ...barStyle, transformOrigin: "center" }}
      />
    </Box>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClose = () => setMenuOpen(false);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(11, 15, 26, 0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Toolbar
        sx={{
          width: "100%",
          px: { xs: 3, sm: 5, md: 8 },
          justifyContent: "space-between",
          minHeight: { xs: "56px", md: "64px" },
        }}
      >
        {/* Brand — always visible */}
        <NavBrand />

        {/* Desktop: nav links + CTA */}
        <Box
          component="nav"
          aria-label="Main navigation"
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 4,
          }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <MuiLink
              key={href}
              href={href}
              underline="none"
              sx={{
                color: "text.secondary",
                fontSize: "0.875rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
                transition: "color 0.2s ease",
                "&:hover": { color: "text.primary" },
                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: "4px",
                  borderRadius: "2px",
                },
              }}
            >
              {label}
            </MuiLink>
          ))}

          <Button
            component="a"
            href="/assets/pdf/2025-TR-CV.pdf"
            download
            size="small"
            sx={{
              bgcolor: "cta.main",
              color: "#fff",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              px: 2.5,
              py: "6px",
              borderRadius: 1.5,
              whiteSpace: "nowrap",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)",
              transition: "filter 0.2s ease, transform 0.1s ease",
              "&:hover": {
                bgcolor: "cta.main",
                filter: "brightness(1.12)",
              },
              "&:active": { transform: "scale(0.97)" },
            }}
          >
            Download CV
          </Button>
        </Box>

        {/* Mobile: hamburger */}
        <IconButton
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          disableRipple
          sx={{
            display: { xs: "flex", md: "none" },
            p: 1,
            color: "text.primary",
            "&:hover": { bgcolor: "transparent" },
          }}
        >
          <HamburgerIcon isOpen={menuOpen} />
        </IconButton>
      </Toolbar>

      {/* Mobile expanded menu */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <MobileMenu open={menuOpen} links={NAV_LINKS} onClose={handleClose} />
      </Box>
    </AppBar>
  );
}
