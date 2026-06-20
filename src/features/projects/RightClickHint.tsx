"use client";

import { Box } from "@mui/material";
import { useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function RightClickHint() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useScrollReveal(ref, { margin: "-60px" });

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
      <Box
        ref={ref}
        sx={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateX(18px)",
          transition:
            "opacity 0.7s 1.4s ease, transform 0.7s 1.4s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
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
      </Box>
    </Box>
  );
}
