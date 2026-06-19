"use client";

import { HeroSection } from "@/features/hero";
import { ProjectsSection } from "@/features/projects";

interface Props {
  serverMessage: string;
}

export default function HomeClient({ serverMessage: _ }: Props) {
  return (
    <>
      <HeroSection />
      <ProjectsSection />
    </>
  );
}
