import { Box, Typography } from "@mui/material";
import { ChatClient } from "./ChatClient";
import { ModalProvider } from "@/features/projects/ModalProvider";

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
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography
          sx={{
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "primary.main",
            mb: 1.5,
          }}
        >
          Ask anything
        </Typography>
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
      </Box>
      <ModalProvider>
        <ChatClient />
      </ModalProvider>
    </Box>
  );
}
