import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog - Tim Rayner",
  description:
    "Writing about AI-native engineering patterns, production systems, and the craft of software development.",
};

export default function BlogPage() {
  return <BlogClient />;
}
