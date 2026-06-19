"use client";

import { useState } from "react";
import { Box } from "@mui/material";

export function FolderIcon({ color, size = 56 }: { color: string; size?: number }) {
  const height = Math.round(size * (44 / 56));
  return (
    <svg width={size} height={height} viewBox="0 0 56 44" fill="none" aria-hidden="true">
      <path
        d="M0 8C0 3.582 3.582 0 8 0H20.343C22.404 0 24.38 0.843 25.808 2.343L27.657 4.333C28.585 5.321 29.856 5.879 31.186 5.879H48C52.418 5.879 56 9.461 56 13.879V36C56 40.418 52.418 44 48 44H8C3.582 44 0 40.418 0 36V8Z"
        fill={color}
        opacity={0.22}
      />
      <path
        d="M0 14C0 11.791 1.791 10 4 10H52C54.209 10 56 11.791 56 14V36C56 40.418 52.418 44 48 44H8C3.582 44 0 40.418 0 36V14Z"
        fill={color}
        opacity={0.55}
      />
      <path
        d="M4 10H52C54.209 10 56 11.791 56 14V17H0V14C0 11.791 1.791 10 4 10Z"
        fill="white"
        opacity={0.06}
      />
    </svg>
  );
}

export function TileIcon({
  logoUrl,
  color,
  size,
}: {
  logoUrl?: string;
  color: string;
  size: number;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(logoUrl) && !logoFailed;

  if (!showLogo) return <FolderIcon color={color} size={size} />;

  const height = Math.round(size * (44 / 56));
  return (
    <Box
      sx={{
        width: size,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Box
        component="img"
        src={logoUrl}
        alt=""
        aria-hidden
        onError={() => setLogoFailed(true)}
        sx={{ display: "block", maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
      />
    </Box>
  );
}

export function NpmLogo({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path
        fill="#CB3837"
        d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v4.997zm4 0v1.336H8.001V8.667h5.334v5.332h-2.665v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.997z"
      />
    </svg>
  );
}

export function ChromeLogo({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="50" cy="50" r="50" fill="#EA4335" />
      <path d="M50,50 L6.7,25 A50,50,0,0,1,50,100 Z" fill="#34A853" />
      <path d="M50,50 L50,100 A50,50,0,0,1,93.3,25 Z" fill="#FBBC05" />
      <circle cx="50" cy="50" r="32" fill="white" />
      <circle cx="50" cy="50" r="22" fill="#4285F4" />
    </svg>
  );
}
