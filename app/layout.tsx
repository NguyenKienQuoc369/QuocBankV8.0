import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Import Component
import { ClickSpark } from "@/components/ui/ClickSpark"; 

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
        {/* 2. Đặt component ở đây để nó nằm trên cùng mọi layer */}
        <ClickSpark />
        {children}
      </body>
    </html>
  );
}