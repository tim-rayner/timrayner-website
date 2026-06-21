"use client";

import type { Project } from "@/features/projects/data/projects";
import { trpc } from "@/lib/trpc";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatProjectTiles } from "./ChatProjectTiles";

type Verdict = "YES" | "NO" | "PARTIAL" | "NONE";

type Turn =
  | { role: "user"; content: string }
  | {
      role: "assistant";
      content: string;
      projects: Project[];
      verdict: Verdict;
    };

const SUGGESTED_PROMPTS = [
  "Has Tim worked with React Native?",
  "What AI/LLM projects has Tim built?",
  "Has Tim used Three.js or BIM/IFC?",
  "Show me Tim's full-stack projects",
];

const VERDICT_COLORS: Record<Exclude<Verdict, "NONE">, string> = {
  YES: "#00D4C4",
  NO: "#FF6B6B",
  PARTIAL: "#F4A261",
};

const VERDICT_LABELS: Record<Exclude<Verdict, "NONE">, string> = {
  YES: "Strong match",
  NO: "Not a fit",
  PARTIAL: "Partial match",
};

const isKnownBadgeVerdict = (v: Verdict): v is Exclude<Verdict, "NONE"> =>
  v === "YES" || v === "NO" || v === "PARTIAL";

export function ChatClient() {
  useTheme();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const hasSentOnce = turns.length > 0;

  const ask = trpc.chat.ask.useMutation({
    onSuccess: (res) => {
      setTurns((t) => [
        ...t,
        {
          role: "assistant",
          content: res.answer,
          projects: res.projects,
          verdict: res.verdict,
        },
      ]);
    },
  });

  const send = useCallback(
    (message: string) => {
      const msg = message.trim();
      if (!msg || ask.isPending || debounced) return;
      const history = turns.map((t) => ({ role: t.role, content: t.content }));
      setTurns((t) => [...t, { role: "user", content: msg }]);
      setInput("");
      setDebounced(true);
      ask.mutate({ message: msg, history });
      setTimeout(() => setDebounced(false), 1000);
    },
    [ask, debounced, turns],
  );

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [turns, ask.isPending]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: "100%",
        maxWidth: 850,
        mx: "auto",
      }}
    >
      {/* Suggested prompts — fade out after first send */}
      <AnimatePresence initial={false}>
        {!hasSentOnce && (
          <motion.div
            initial={false}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {SUGGESTED_PROMPTS.map((prompt) => (
                <Chip
                  key={prompt}
                  label={prompt}
                  variant="outlined"
                  onClick={() => send(prompt)}
                  sx={{
                    borderColor: "rgba(124,93,255,0.35)",
                    color: "text.secondary",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      color: "text.primary",
                      bgcolor: "rgba(124,93,255,0.08)",
                    },
                  }}
                />
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript */}
      {hasSentOnce && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <Typography
              component="button"
              onClick={() => setTurns([])}
              sx={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.75rem",
                color: "text.disabled",
                p: 0,
                transition: "color 0.15s ease",
                "&:hover": { color: "text.secondary" },
              }}
            >
              Clear chat
            </Typography>
          </Box>
          <Box
            ref={transcriptRef}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              maxHeight: 520,
              overflowY: "auto",
              pr: 0.5,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {turns.map((turn, i) =>
              turn.role === "user" ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ alignSelf: "flex-end", maxWidth: "80%" }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: "rgba(124,93,255,0.12)",
                      border: "1px solid rgba(124,93,255,0.25)",
                      borderRadius: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        color: "text.primary",
                        lineHeight: 1.6,
                      }}
                    >
                      {turn.content}
                    </Typography>
                  </Box>
                </motion.div>
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {isKnownBadgeVerdict(turn.verdict) ? (
                      <Box
                        sx={{
                          px: 1.25,
                          py: 0.25,
                          borderRadius: 1,
                          bgcolor: `${VERDICT_COLORS[turn.verdict]}18`,
                          border: `1px solid ${VERDICT_COLORS[turn.verdict]}40`,
                          display: "inline-flex",
                          alignSelf: "flex-start",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            color: VERDICT_COLORS[turn.verdict],
                            textTransform: "uppercase",
                          }}
                        >
                          {VERDICT_LABELS[turn.verdict]}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: "text.disabled",
                          fontStyle: "italic",
                        }}
                      >
                        {
                          "Tim hasn't told me much about this yet — why not reach out to him directly "
                        }
                        <Box
                          component="a"
                          href="#contact"
                          sx={{
                            color: "text.secondary",
                            textDecoration: "underline",
                            textUnderlineOffset: "2px",
                            "&:hover": { color: "text.primary" },
                          }}
                        >
                          here
                        </Box>
                        ?
                      </Typography>
                    )}
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        color: "text.secondary",
                        lineHeight: 1.7,
                      }}
                    >
                      {turn.content}
                    </Typography>
                    {turn.projects.length > 0 && (
                      <ChatProjectTiles projects={turn.projects} />
                    )}
                  </Box>
                </motion.div>
              ),
            )}

            {ask.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CircularProgress
                    size={14}
                    thickness={5}
                    sx={{ color: "primary.main", opacity: 0.6 }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.82rem",
                      color: "text.disabled",
                      fontStyle: "italic",
                    }}
                  >
                    Thinking…
                  </Typography>
                </Box>
              </motion.div>
            )}
          </Box>
        </Box>
      )}

      {/* Input row */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Ask about Tim's work…"
          fullWidth
          multiline
          maxRows={4}
          size="small"
          disabled={ask.isPending}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.9rem",
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.03)",
              "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
              "&:hover fieldset": { borderColor: "rgba(124,93,255,0.4)" },
              "&.Mui-focused fieldset": { borderColor: "primary.main" },
            },
          }}
        />
        <IconButton
          aria-label="Send message"
          onClick={() => send(input)}
          disabled={!input.trim() || ask.isPending || debounced}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            width: 40,
            height: 40,
            borderRadius: 2,
            flexShrink: 0,
            transition: "all 0.18s ease",
            "&:hover": { bgcolor: "#6B4EE6", transform: "translateY(-1px)" },
            "&:active": { transform: "translateY(0px) scale(0.97)" },
            "&.Mui-disabled": {
              bgcolor: "rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.3)",
            },
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </IconButton>
      </Box>

      {ask.error && (
        <Typography sx={{ fontSize: "0.8rem", color: "#FF6B6B" }}>
          Something went wrong. Please try again.
        </Typography>
      )}
    </Box>
  );
}
