"use client";

import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

interface Props {
  onSubmit?: (email: string) => void;
}

export default function ConnectForm({ onSubmit }: Props) {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.(email);
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        gap: 1.5,
        flexDirection: { xs: "column", sm: "row" },
        maxWidth: 460,
      }}
    >
      <TextField
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        size="small"
        inputProps={{ "aria-label": "Email address" }}
        sx={{
          flex: 1,
          "& .MuiOutlinedInput-root": {
            bgcolor: "background.paper",
            borderRadius: 1.5,
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="cta"
        sx={{
          px: 3,
          py: "9px",
          fontWeight: 700,
          fontSize: "0.875rem",
          borderRadius: 1.5,
          whiteSpace: "nowrap",
          flexShrink: 0,
          letterSpacing: "0.01em",
        }}
      >
        Connect with me
      </Button>
    </Box>
  );
}
