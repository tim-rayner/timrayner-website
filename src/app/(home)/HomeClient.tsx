"use client";

import { CareerSnapshot } from "@/features/career-snapshot";
import { ContactSection } from "@/features/contact";
import { HeroSection } from "@/features/hero";
import { ProjectsSection } from "@/features/projects";
import { ReadmeViewer } from "@/features/readme/ReadmeViewer";
import { Box } from "@mui/material";

interface Props {
  serverMessage: string;
}

function SectionDivider() {
  return (
    <Box
      aria-hidden
      sx={{
        height: 1,
        background:
          "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent 100%)",
        pointerEvents: "none",
      }}
    />
  );
}

export default function HomeClient({ serverMessage: _ }: Props) {
  return (
    <>
      <HeroSection />
      <Box sx={{ px: { xs: 3, sm: 5, md: 8 } }}>
        <ProjectsSection />
        <SectionDivider />
        <ReadmeViewer />
        <SectionDivider />
        <CareerSnapshot />
        <SectionDivider />
        <ContactSection />
      </Box>
    </>
  );
}
