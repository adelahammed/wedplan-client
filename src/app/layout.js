import * as React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WedPlan | Luxury Wedding Planning & Verified Vendors",
  description: "Curated wedding venues, fine art photographers, bespoke floral artisans, and luxury caterers for your unforgettable wedding day.",
  icons: {
    icon: "/assets/Favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fdfbf7] text-[#1c1914] dark:bg-[#14120e] dark:text-[#f5f0e6]">
        <React.Suspense fallback={<div className="h-20 w-full border-b border-[#e7e0d3] bg-[#fdfbf7]" />}>
          <Navbar />
        </React.Suspense>
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
