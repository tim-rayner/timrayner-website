"use client";

import { useState, useEffect, useCallback } from "react";
import { Box, Typography, InputBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import CheckIcon from "@mui/icons-material/Check";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  number: z.string().min(1, "Phone number is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFields = z.infer<typeof contactSchema>;
type FieldErrors = Partial<Record<keyof ContactFields, string>>;

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  multiline?: boolean;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  type?: string;
}

function FormField({ label, value, onChange, error, placeholder, multiline, inputMode, type }: FieldProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
      <Typography
        component="label"
        sx={{
          fontSize: "0.6875rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          px: 1.75,
          py: multiline ? 1.5 : 0,
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)",
          bgcolor: "rgba(255,255,255,0.03)",
          transition: "border-color 0.18s ease, background-color 0.18s ease",
          "&:focus-within": {
            borderColor: error ? "rgba(239,68,68,0.5)" : "rgba(124,93,255,0.45)",
            bgcolor: "rgba(255,255,255,0.055)",
          },
        }}
      >
        <InputBase
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          multiline={multiline}
          rows={multiline ? 4 : undefined}
          type={type}
          inputProps={{ inputMode, "aria-label": label }}
          sx={{
            width: "100%",
            fontSize: "0.875rem",
            color: "text.primary",
            lineHeight: 1.7,
            py: multiline ? 0 : 1.25,
            "& input, & textarea": { p: 0 },
            "& textarea": { resize: "none" },
            "& input::placeholder, & textarea::placeholder": {
              color: "rgba(255,255,255,0.22)",
              opacity: 1,
            },
          }}
        />
      </Box>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key={error}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            <Typography sx={{ fontSize: "0.75rem", color: "rgba(239,68,68,0.85)", lineHeight: 1 }}>
              {error}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export interface ContactModalProps {
  onClose: () => void;
}

export function ContactModal({ onClose }: ContactModalProps) {
  const [fields, setFields] = useState<ContactFields>({ name: "", number: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback(<K extends keyof ContactFields>(key: K, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = contactSchema.safeParse(fields);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ContactFields;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setSubmitting(true);
    // Simulate async dispatch — wire to tRPC when ready
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  }

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
        aria-label="Contact form"
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
              <CloseIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.55)" }} />
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
                Contact Me
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.75,
                  maxWidth: "42ch",
                }}
              >
                So you want to work together on a new project... fill out the form below with your
                ideas, or alternatively give me a call on my{" "}
                <Box
                  component="a"
                  href="tel:07512282997"
                  sx={{
                    color: "rgba(124,93,255,0.9)",
                    textDecoration: "underline",
                    textDecorationColor: "rgba(124,93,255,0.4)",
                    transition: "color 0.15s ease",
                    "&:hover": { color: "#B39DFF" },
                  }}
                >
                  mobile
                </Box>
              </Typography>
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.07)" }} />

          {/* Body */}
          <Box sx={{ p: { xs: "24px", sm: "28px 32px 32px" } }}>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      py: 4,
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        bgcolor: "rgba(16,185,129,0.12)",
                        border: "1px solid rgba(16,185,129,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 24, color: "rgb(16,185,129)" }} />
                    </Box>
                    <Box>
                      <Typography
                        sx={{ fontSize: "1rem", fontWeight: 600, color: "text.primary", mb: 0.5 }}
                      >
                        Message sent
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)" }}>
                        I&apos;ll be in touch soon.
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <FormField
                      label="Name"
                      value={fields.name}
                      onChange={(v) => setField("name", v)}
                      error={errors.name}
                      placeholder="Your full name"
                    />
                    <FormField
                      label="Number"
                      value={fields.number}
                      onChange={(v) => setField("number", v)}
                      error={errors.number}
                      placeholder="Your phone number"
                      inputMode="tel"
                      type="tel"
                    />
                    <FormField
                      label="Message"
                      value={fields.message}
                      onChange={(v) => setField("message", v)}
                      error={errors.message}
                      placeholder="Tell me about your project idea..."
                      multiline
                    />

                    {/* Submit */}
                    <Box
                      component="button"
                      type="submit"
                      disabled={submitting}
                      sx={{
                        mt: 0.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        width: "100%",
                        py: 1.375,
                        borderRadius: 1.75,
                        border: "1px solid rgba(124,93,255,0.4)",
                        bgcolor: "rgba(124,93,255,0.16)",
                        color: "#B39DFF",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        cursor: submitting ? "not-allowed" : "pointer",
                        opacity: submitting ? 0.6 : 1,
                        transition: "all 0.18s ease",
                        "&:hover:not(:disabled)": {
                          bgcolor: "rgba(124,93,255,0.24)",
                          borderColor: "rgba(124,93,255,0.6)",
                        },
                        "&:active:not(:disabled)": {
                          transform: "scale(0.98)",
                        },
                      }}
                    >
                      {submitting ? (
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            border: "2px solid rgba(179,157,255,0.3)",
                            borderTopColor: "#B39DFF",
                            animation: "spin 0.7s linear infinite",
                            "@keyframes spin": { to: { transform: "rotate(360deg)" } },
                          }}
                        />
                      ) : (
                        <SendIcon sx={{ fontSize: 15 }} />
                      )}
                      {submitting ? "Sending…" : "Send message"}
                    </Box>
                  </Box>
                </motion.form>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
