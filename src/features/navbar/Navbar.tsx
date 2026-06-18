"use client";

import { AppBar, Box, Link as MuiLink, Toolbar } from "@mui/material";
import NavBrand from "./NavBrand";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Career", href: "#career" },
  { label: "Contact", href: "#contact" },
] as const;

export default function Navbar() {
  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "rgba(11, 15, 26, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
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
          {/* Brand: desktop only */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
            <NavBrand />
          </Box>

          {/* Nav links: centered on mobile, right-aligned on desktop */}
          <Box
            component="nav"
            aria-label="Main navigation"
            sx={{
              display: "flex",
              gap: { xs: 3, sm: 4 },
              mx: { xs: "auto", md: 0 },
            }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <MuiLink
                key={href}
                href={href}
                underline="none"
                sx={{
                  color: "text.primary",
                  fontSize: { xs: "0.875rem", md: "0.9rem" },
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: "primary.main",
                  },
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
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
