"use client";

import { useEffect, useState } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ChatClient } from "./ChatClient";
import { ModalProvider } from "@/features/projects/ModalProvider";

const RAG_TOOLTIP =
  "A RAG-powered AI assistant built on OpenAI embeddings and Supabase pgvector. Ask about technologies, project domains, or anything in my work — semantically matched content is retrieved and answered by GPT-4o-mini, with relevant projects surfaced automatically.";

const infoIconSx = {
  fontSize: { xs: "1.1rem", md: "1.25rem" },
  color: "text.disabled",
  cursor: "help",
  flexShrink: 0,
  mt: { xs: 0.5, md: 0.75 },
  transition: "color 0.15s ease",
  "&:hover": { color: "text.secondary" },
};

function ChatInfoIcon() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const icon = <InfoOutlinedIcon sx={infoIconSx} />;

  if (!mounted) {
    return icon;
  }

  return (
    <Tooltip
      title={RAG_TOOLTIP}
      placement="right"
      arrow
      slotProps={{
        tooltip: {
          sx: {
            maxWidth: 300,
            fontSize: "0.78rem",
            lineHeight: 1.6,
            bgcolor: "background.paper",
            color: "text.secondary",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            p: 1.5,
          },
        },
        arrow: {
          sx: { color: "background.paper" },
        },
      }}
    >
      {icon}
    </Tooltip>
  );
}

export function ChatSection() {
  return (
    <Box
      component="section"
      id="chat"
      sx={{
        py: { xs: 5, md: 11 },
        maxWidth: 1200,
        mx: "auto",
        scrollMarginTop: { xs: "56px", md: "64px" },
      }}
    >
      <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: "center" }}>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "primary.main",
            mb: 1.25,
          }}
        >
          Ask anything
        </Typography>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.4rem", sm: "3rem", md: "3.5rem" },
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              color: "text.primary",
            }}
          >
            Chat with my portfolio
          </Typography>
          <ChatInfoIcon />
        </Box>
      </Box>

      <ModalProvider>
        <ChatClient />
      </ModalProvider>
    </Box>
  );
}
