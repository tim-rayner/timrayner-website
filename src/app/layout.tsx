import type { Metadata } from "next";
import "./globals.css";
import MuiProvider from "@/theme/MuiProvider";
import TrpcProvider from "@/lib/TrpcProvider";

export const metadata: Metadata = {
  title: "Whatever Next",
  description: "Next.js + MUI + tRPC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TrpcProvider>
          <MuiProvider>{children}</MuiProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
