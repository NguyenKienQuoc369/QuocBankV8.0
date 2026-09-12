import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientSpark from "@/components/ui/ClientSpark";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuocBank - Ngân Hàng Lượng Tử",
  description: "Trải nghiệm tài chính không gian",
  other: {
    "adq-verification": "adq-verify-MPRm6-hHWSgYoJwNPpynGPtCuHRXM1nF",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientSpark />
        {children}
      </body>
    </html>
  );
}