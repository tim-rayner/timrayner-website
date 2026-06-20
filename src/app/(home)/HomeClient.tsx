"use client";

import { HeroSection } from "@/features/hero";
import { ProjectsSection } from "@/features/projects";
import { ReadmeViewer } from "@/features/readme/ReadmeViewer";

interface Props {
  serverMessage: string;
  rawReadme: string;
}

export default function HomeClient({ serverMessage: _, rawReadme }: Props) {
  return (
    <>
      <HeroSection />
      <ProjectsSection />
      <ReadmeViewer rawContent={rawReadme} />
    </>
  );
}
