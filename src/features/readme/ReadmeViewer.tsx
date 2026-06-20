"use client";

import { Box, Typography } from "@mui/material";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const MotionBox = motion(Box);

// ─── Markdown primitives ────────────────────────────────────────────────────

function FileIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 16 16"
      aria-hidden
      sx={{ width: 15, height: 15, flexShrink: 0, mt: "1px" }}
    >
      <path
        fill="currentColor"
        d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"
      />
    </Box>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <Box
      component="code"
      sx={{
        fontFamily:
          '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
        fontSize: "0.83em",
        px: 0.75,
        py: 0.2,
        borderRadius: "4px",
        bgcolor: "rgba(124, 93, 255, 0.1)",
        color: "info.main",
        border: "1px solid rgba(124, 93, 255, 0.18)",
      }}
    >
      {children}
    </Box>
  );
}

function MdH1({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="h1"
      sx={{
        fontSize: { xs: "1.65rem", md: "1.875rem" },
        fontWeight: 700,
        lineHeight: 1.25,
        letterSpacing: "-0.022em",
        color: "text.primary",
        pb: 1.5,
        mb: 2.5,
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {children}
    </Typography>
  );
}

function MdH2({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="h2"
      sx={{
        fontSize: { xs: "1.1rem", md: "1.25rem" },
        fontWeight: 600,
        lineHeight: 1.35,
        letterSpacing: "-0.015em",
        color: "text.primary",
        pb: 0.875,
        mb: 1.75,
        mt: 4,
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      {children}
    </Typography>
  );
}

function MdP({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="p"
      sx={{
        fontSize: { xs: "0.92rem", md: "0.95rem" },
        lineHeight: 1.8,
        color: "text.secondary",
        m: 0,
        mb: 2,
      }}
    >
      {children}
    </Typography>
  );
}

function MdBlockquote({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        borderLeft: "3px solid",
        borderColor: "primary.main",
        pl: 2.5,
        mb: 3,
      }}
    >
      <Typography
        component="p"
        sx={{
          fontSize: { xs: "0.95rem", md: "1rem" },
          lineHeight: 1.75,
          color: "text.disabled",
          fontStyle: "italic",
          m: 0,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

function MdHr() {
  return (
    <Box
      component="hr"
      sx={{
        border: "none",
        borderTop: "1px solid rgba(255, 255, 255, 0.07)",
        my: 3.5,
      }}
    />
  );
}

function MdUl({ items }: { items: string[] }) {
  return (
    <Box component="ul" sx={{ pl: 0, mb: 2.5, mt: 0, listStyle: "none" }}>
      {items.map((item, i) => (
        <Box
          component="li"
          key={i}
          sx={{
            display: "flex",
            gap: 1.25,
            mb: 1.25,
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              mt: "6px",
              width: 5,
              height: 5,
              borderRadius: "50%",
              bgcolor: "primary.main",
              flexShrink: 0,
            }}
          />
          <Typography
            component="span"
            sx={{
              fontSize: { xs: "0.92rem", md: "0.95rem" },
              lineHeight: 1.8,
              color: "text.secondary",
            }}
          >
            {parseInline(item)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function MdCode({ code }: { code: string }) {
  return (
    <Box
      sx={{
        bgcolor: "rgba(0, 0, 0, 0.35)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: 1.5,
        p: { xs: 2.5, md: 3 },
        mb: 2.5,
        overflowX: "auto",
      }}
    >
      <Box
        component="pre"
        sx={{
          fontFamily:
            '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
          fontSize: { xs: "0.78rem", md: "0.82rem" },
          lineHeight: 1.75,
          m: 0,
          color: "text.secondary",
          whiteSpace: "pre",
        }}
      >
        <Box component="code">{code}</Box>
      </Box>
    </Box>
  );
}

// ─── Inline parser ───────────────────────────────────────────────────────────

function parseInline(text: string): React.ReactNode {
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(
        <Box
          key={match.index}
          component="strong"
          sx={{ color: "text.primary", fontWeight: 600 }}
        >
          {token.slice(2, -2)}
        </Box>,
      );
    } else {
      parts.push(
        <InlineCode key={match.index}>{token.slice(1, -1)}</InlineCode>,
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

// ─── Block parser ────────────────────────────────────────────────────────────

function renderMarkdown(content: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const lines = content.split("\n");
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      nodes.push(<MdH1 key={key++}>{parseInline(line.slice(2))}</MdH1>);
      i++;
    } else if (line.startsWith("## ")) {
      nodes.push(<MdH2 key={key++}>{parseInline(line.slice(3))}</MdH2>);
      i++;
    } else if (line.startsWith("> ")) {
      nodes.push(
        <MdBlockquote key={key++}>{parseInline(line.slice(2))}</MdBlockquote>,
      );
      i++;
    } else if (line.trim() === "---") {
      nodes.push(<MdHr key={key++} />);
      i++;
    } else if (line.startsWith("```")) {
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      nodes.push(<MdCode key={key++} code={codeLines.join("\n")} />);
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(<MdUl key={key++} items={items} />);
    } else {
      const paragraphLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !lines[i].startsWith("#") &&
        !lines[i].startsWith(">") &&
        !lines[i].startsWith("- ") &&
        !lines[i].startsWith("```") &&
        lines[i].trim() !== "---"
      ) {
        paragraphLines.push(lines[i]);
        i++;
      }
      if (paragraphLines.length > 0) {
        nodes.push(
          <MdP key={key++}>{parseInline(paragraphLines.join(" "))}</MdP>,
        );
      }
    }
  }

  return nodes;
}

// ─── Viewer ──────────────────────────────────────────────────────────────────

interface Props {
  rawContent: string;
}

export function ReadmeViewer({ rawContent }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [copied, setCopied] = useState(false);

  const lineCount = rawContent.trim().split("\n").length;

  function handleCopy() {
    navigator.clipboard.writeText(rawContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const actions = [
    {
      key: "raw",
      label: "Raw",
      onClick: undefined as (() => void) | undefined,
    },
    {
      key: "copy",
      label: copied ? "Copied!" : "Copy raw file",
      onClick: handleCopy,
    },
  ];

  const stats = ["1 contributor", `${lineCount} lines`, "updated recently"];

  return (
    <Box
      ref={ref}
      component="section"
      id="readme"
      aria-label="README"
      sx={{ bgcolor: "background.default", py: { xs: 10, md: 14 } }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Section header */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
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
            A bit about me...
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "2.1rem", md: "2.8rem" },
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "text.primary",
              mb: 1.5,
            }}
          >
            How I Work
          </Typography>
        </Box>

        <MotionBox
          initial={{ opacity: 0, y: 36 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 72, damping: 22 }}
          sx={{
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* File header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.5,
              px: { xs: 2.5, md: 3 },
              py: 1.5,
              bgcolor: "rgba(0, 0, 0, 0.28)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <FileIcon />
              {(
                [
                  { text: "timrayner", muted: false, bold: false },
                  { text: "/", muted: true, bold: false },
                  { text: "README.md", muted: false, bold: true },
                ] satisfies Array<{
                  text: string;
                  muted: boolean;
                  bold: boolean;
                }>
              ).map((seg, i) => (
                <Typography
                  key={i}
                  component="span"
                  sx={{
                    fontSize: "0.78rem",
                    fontWeight: seg.bold ? 700 : seg.muted ? 400 : 500,
                    color: seg.muted
                      ? "text.disabled"
                      : seg.bold
                        ? "text.primary"
                        : "secondary.main",
                    lineHeight: 1,
                  }}
                >
                  {seg.text}
                </Typography>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 0.75 }}>
              {actions.map(({ key, label, onClick }) => (
                <Box
                  key={key}
                  onClick={onClick}
                  role={onClick ? "button" : undefined}
                  tabIndex={onClick ? 0 : undefined}
                  sx={{
                    px: 1.5,
                    py: 0.625,
                    borderRadius: 1,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    bgcolor: "rgba(255, 255, 255, 0.04)",
                    cursor: onClick ? "pointer" : "default",
                    transition:
                      "background-color 0.15s, border-color 0.15s, transform 0.1s",
                    userSelect: "none",
                    "&:hover": onClick
                      ? {
                          bgcolor: "rgba(255, 255, 255, 0.08)",
                          borderColor: "rgba(255, 255, 255, 0.16)",
                        }
                      : {},
                    "&:active": onClick ? { transform: "scale(0.97)" } : {},
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      lineHeight: 1,
                      color:
                        key === "copy" && copied
                          ? "success.main"
                          : "text.secondary",
                      transition: "color 0.15s",
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Stats bar */}
          <Box
            sx={{
              px: { xs: 2.5, md: 3 },
              py: 0.875,
              bgcolor: "rgba(0, 0, 0, 0.14)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {stats.map((stat, i) => (
              <Box
                key={stat}
                sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
              >
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "text.disabled",
                    lineHeight: 1,
                  }}
                >
                  {stat}
                </Typography>
                {i < stats.length - 1 && (
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      color: "text.disabled",
                      lineHeight: 1,
                      opacity: 0.35,
                    }}
                  >
                    ·
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          {/* Rendered markdown */}
          <Box
            sx={{
              bgcolor: "background.paper",
              px: { xs: 3, sm: 4.5, md: 6 },
              py: { xs: 4, md: 5.5 },
            }}
          >
            {renderMarkdown(rawContent)}
          </Box>
        </MotionBox>
      </Box>
    </Box>
  );
}
