"use client";

import { HeroSection } from "@/features/hero";

interface Props {
  serverMessage: string;
}

export default function HomeClient({ serverMessage: _ }: Props) {
  return (
    <>
      <HeroSection />
      <div style={{ padding: "20px", height: "100vh" }}>
        <h1>Hello</h1>
      </div>
    </>
  );
}
