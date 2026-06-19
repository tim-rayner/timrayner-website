"use client";

import { Box } from "@mui/material";
import { motion } from "framer-motion";

export function RightClickHint() {
  return (
    <Box
      sx={{
        display: { xs: "none", xl: "block" },
        position: "absolute",
        left: "calc(100% + 75px)",
        top: "11%",
        width: "150px",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: 18 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 50, damping: 16, delay: 1.6 }}
      >
        {/* Handwritten text */}
        <p
          style={{
            fontFamily: "var(--font-caveat)",
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.42)",
            lineHeight: 1.5,
            margin: 0,
            transform: "rotate(-6deg)",
            display: "inline-block",
            transformOrigin: "center top",
          }}
        >
          try right
          <br />
          clicking on
          <br />a project
        </p>

        {/* Hand-drawn arrow — curves from text toward grid (down-left) */}
        <svg
          width="88"
          height="62"
          viewBox="0 0 88 62"
          fill="none"
          aria-hidden
          style={{ display: "block", marginTop: "6px" }}
        >
          <path
            d="M74,6 C68,14 52,32 28,48 C20,53 12,57 8,58"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="1.9"
            strokeLinecap="round"
            fill="none"
          />
          {/* Arrowhead at (8,58) pointing down-left */}
          <path
            d="M8,58 L18,46"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            d="M8,58 L22,60"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </Box>
  );
}
