import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kilimo Radar — World events, translated for Kenyan farmers",
  description:
    "Free platform helping Kenyan farmers navigate geopolitics, shipping disruptions, regulations and market shifts affecting their exports — and connect directly with buyers at no cost.",
  keywords: [
    "Kenya farmers",
    "Kenya exports",
    "tea coffee avocado flowers",
    "geopolitics agriculture",
    "farm marketplace Kenya",
    "export intelligence",
  ],
  openGraph: {
    title: "Kilimo Radar — World events, translated for Kenyan farmers",
    description:
      "Know the world. Sell your harvest. Free geopolitical intelligence and buyer connections for Kenyan export farmers.",
    siteName: "Kilimo Radar",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
