import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Import Component
import ClientSpark from '@/components/ui/ClientSpark'

// Prevent build-time prerendering for the entire app (avoid client-hook execution during static export)
export const dynamic = 'force-dynamic'

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
        {/* 2. Đặt component ở đây để nó nằm trên cùng mọi layer (client-only) */}
        <ClientSpark />
        {children}
      </body>
    </html>
  );
}