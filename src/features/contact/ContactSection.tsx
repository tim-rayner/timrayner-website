"use client";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { Box, ButtonBase, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

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
    <MotionBox
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <ButtonBase
        component="a"
        href={href}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
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
    </MotionBox>
  );
}

export default function ContactSection() {
  return (
    <Box
      component="section"
      id="contact"
      aria-label="Contact"
      sx={{
        pt: { xs: 8, md: 11 },
        pb: { xs: 8, md: 11 },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 6, md: 8 },
          alignItems: "center",
        }}
      >
        {/* Left: heading block */}
        <Box>
          <Typography
            component="p"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "primary.main",
              mb: 2,
            }}
          >
            Contact
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "2.6rem", md: "3.2rem", lg: "3.8rem" },
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
              color: "text.primary",
              mb: 3,
            }}
          >
            Let&apos;s work
            <br />
            <Box component="span" sx={{ color: "primary.main" }}>
              together.
            </Box>
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "1rem",
              lineHeight: 1.75,
              maxWidth: "38ch",
            }}
          >
            Open to new opportunities. Reach out directly.
          </Typography>
        </Box>

        {/* Right: contact tiles */}
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
  );
}
