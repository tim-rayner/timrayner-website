"use client";

import { HeroSection } from "@/features/hero";

interface Props {
  serverMessage: string;
}

export default function HomeClient({ serverMessage: _ }: Props) {
  return <HeroSection />;
}
