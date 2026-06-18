"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import ConnectForm from "./ConnectForm";

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

function Portrait({ size }: { size: number }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "2px solid",
        borderColor: "primary.main",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        boxShadow: "0 12px 48px -12px rgba(124, 93, 255, 0.35)",
      }}
    >
      <Image
        src="/tim.png"
        alt="Tim Rayner"
        fill
        priority
        sizes={`${size}px`}
        style={{ objectFit: "cover", objectPosition: "top center" }}
      />
    </Box>
  );
}

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
      }}
    >
      {/* Left: content */}
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
          px: { xs: 3, sm: 5, md: 8 },
          py: { xs: 8, md: 10 },
        }}
      >
        {/* Mobile-only portrait */}
        <MotionBox
          variants={itemVariants}
          sx={{ display: { xs: "flex", md: "none" }, mb: 4 }}
        >
          <Portrait size={140} />
        </MotionBox>

        {/* Name + role */}
        <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
          <Typography
            component="p"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 400,
              color: "text.secondary",
              lineHeight: 1.3,
            }}
          >
            Full-Stack Software Engineer
          </Typography>
        </MotionBox>

        {/* Headline */}
        <MotionBox variants={itemVariants} sx={{ mb: 3 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: "2.4rem",
                sm: "3rem",
                md: "3.2rem",
                lg: "3.8rem",
              },
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: "text.primary",
            }}
          >
            Building digital products, brands &{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              scalable experiences.
            </Box>
          </Typography>
        </MotionBox>

        {/* Supporting copy */}
        <MotionBox variants={itemVariants} sx={{ mb: 5 }}>
          <Typography
            sx={{
              color: "text.secondary",
              lineHeight: 1.75,
              fontSize: "1rem",
              maxWidth: "48ch",
            }}
          >
            I&apos;m a{" "}
            <Box
              component="strong"
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              Full-Stack Software Engineer
            </Box>{" "}
            based in Norwich, Norfolk. I specialise in user experience, scalable
            systems, and product-minded software delivery.
          </Typography>
        </MotionBox>

        {/* Form */}
        <MotionBox
          variants={itemVariants}
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <ConnectForm />
        </MotionBox>
      </MotionBox>

      {/* Right: full-height background image (desktop only) */}
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
          sizes="45vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        {/* Fade into background on the left edge */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            left: 0,
            top: 0,
            bottom: 0,
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
