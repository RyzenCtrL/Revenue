import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { TelegramInit } from "@/components/TelegramInit";
import "./globals.css";

export const metadata: Metadata = {
  title: "Revenue — Sales Analytics",
  description: "Premium sales analytics dashboard (demo, mock data)",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#050706",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased min-h-screen w-full max-w-[100vw] overflow-x-hidden">
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <TelegramInit />
        {children}
      </body>
    </html>
  );
}
