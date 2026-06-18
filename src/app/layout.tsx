import TrpcProvider from "@/lib/TrpcProvider";
import MuiProvider from "@/theme/MuiProvider";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Software Engineer - Tim Rayner",
  description:
    "Software Engineer with over 7 years of experience in the industry. Embracing AI and automation to build better software.",
  keywords: [
    "Software Engineer",
    "AI",
    "Automation",
    "Software Development",
    "Software Engineering",
    "Software Architecture",
    "Software Design",
    "Software Development",
    "Software Engineering",
    "Software Architecture",
    "Software Design",
  ],
  authors: [{ name: "Tim Rayner", url: "https://timrayner.com" }],
  openGraph: {
    title: "Software Engineer - Tim Rayner",
    description:
      "Software Engineer with over 7 years of experience in the industry. Embracing AI and automation to build better software.",
    url: "https://timrayner.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <TrpcProvider>
          <MuiProvider>{children}</MuiProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
