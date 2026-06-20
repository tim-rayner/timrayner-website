"use client";

import CloseIcon from "@mui/icons-material/Close";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { Box, ButtonBase, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect } from "react";

function ContactTile({
  label,
  sublabel,
  href,
  Icon,
  external,
}: {
  label: string;
  sublabel: string;
  href: string;
  Icon: React.ElementType;
  external?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <ButtonBase
        component="a"
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        aria-label={label}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 2.5,
          px: 3,
          py: 2.25,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "rgba(255,255,255,0.08)",
          bgcolor: "rgba(255,255,255,0.03)",
          textAlign: "left",
          transition: "border-color 0.25s ease, background-color 0.25s ease",
          "&:hover": {
            borderColor: "rgba(255,255,255,0.18)",
            bgcolor: "rgba(255,255,255,0.05)",
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1.5,
            bgcolor: external
              ? "rgba(77, 142, 255, 0.1)"
              : "rgba(124, 93, 255, 0.1)",
          }}
        >
          <Icon
            sx={{
              fontSize: 18,
              color: external ? "secondary.main" : "primary.main",
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "text.secondary",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              lineHeight: 1,
              mb: 0.5,
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.9375rem",
              fontWeight: 500,
              color: "text.primary",
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            {sublabel}
          </Typography>
        </Box>

        <OpenInNewOutlinedIcon sx={{ fontSize: 16, color: "text.disabled" }} />
      </ButtonBase>
    </motion.div>
  );
}

export interface ContactModalProps {
  onClose: () => void;
}

export function ContactModal({ onClose }: ContactModalProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1500,
        display: "flex",
        alignItems: { xs: "flex-end", sm: "center" },
        justifyContent: "center",
        p: { xs: 0, sm: 3 },
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
          background: "rgba(5, 7, 14, 0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 520,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Contact"
      >
        <Box
          sx={{
            bgcolor: "rgba(14, 18, 30, 0.97)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: { xs: "20px 20px 0 0", sm: "20px" },
            overflow: "hidden",
            boxShadow:
              "0 48px 96px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              position: "relative",
              p: { xs: "28px 24px 24px", sm: "32px 32px 24px" },
              overflow: "hidden",
            }}
          >
            {/* Ambient wash */}
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse 90% 150% at 10% -30%, rgba(124,93,255,0.18) 0%, transparent 60%)",
                pointerEvents: "none",
              }}
            />

            {/* Close */}
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
                bgcolor: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 1,
                transition: "background-color 0.15s ease",
                "&:hover": { bgcolor: "rgba(255,255,255,0.13)" },
                "&:active": { transform: "scale(0.93)" },
              }}
            >
              <CloseIcon
                sx={{ fontSize: 15, color: "rgba(255,255,255,0.55)" }}
              />
            </Box>

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                  fontWeight: 700,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.1,
                  color: "text.primary",
                  mb: 1.25,
                  pr: 5,
                }}
              >
                Lets build something new together
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.75,
                  maxWidth: "42ch",
                }}
              >
                So you want to work together on a new project? Let&apos;s chat!
              </Typography>
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.07)" }} />

          {/* Body */}
          <Box sx={{ p: { xs: "24px", sm: "28px 32px 32px" } }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <ContactTile
                label="Email"
                sublabel="Drop me a line"
                href="mailto:tim.rayner2020@gmail.com"
                Icon={EmailOutlinedIcon}
              />
              <ContactTile
                label="Phone"
                sublabel="Give me a call"
                href="tel:+447512282997"
                Icon={PhoneOutlinedIcon}
              />
              <ContactTile
                label="LinkedIn"
                sublabel="View my LinkedIn profile"
                href="https://www.linkedin.com/in/tim-rayner/"
                Icon={LinkedInIcon}
                external
              />
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
