import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diamond Bank | Global Secure Banking",
  description: "Experience world-class online banking with Diamond Bank.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>{children}</body>
    </html>
  );
}
