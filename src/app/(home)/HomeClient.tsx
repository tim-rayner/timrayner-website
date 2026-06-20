"use client";

import { CareerSnapshot } from "@/features/career-snapshot";
import { ContactSection } from "@/features/contact";
import { HeroSection } from "@/features/hero";
import { ProjectsSection } from "@/features/projects";
import { ReadmeViewer } from "@/features/readme/ReadmeViewer";
import { Box } from "@mui/material";

interface Props {
  serverMessage: string;
  rawReadme: string;
}

export default function HomeClient({ serverMessage: _, rawReadme }: Props) {
  return (
    <>
      <HeroSection />
      <Box sx={{ px: { xs: 3, sm: 5, md: 8 } }}>
        <ProjectsSection />
        <ReadmeViewer rawContent={rawReadme} />
        <CareerSnapshot />
        <ContactSection />
      </Box>
    </>
  );
}
